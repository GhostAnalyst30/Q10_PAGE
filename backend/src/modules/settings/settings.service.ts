import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getRates() {
    const rates = await this.prisma.exchangeRate.findMany();
    if (rates.length === 0) {
      await this.seedDefaults();
      return this.prisma.exchangeRate.findMany();
    }
    return rates;
  }

  async updateRate(currency: string, rate: number) {
    return this.prisma.exchangeRate.upsert({
      where: { currency },
      update: { rate },
      create: { currency, rate },
    });
  }

  async fetchRatesFromApi() {
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      const data = await res.json();
      if (data.result !== 'success') throw new Error('API error');

      const map: Record<string, string> = { COP: 'COP', EUR: 'EUR', MXN: 'MXN' };
      for (const [code, apiKey] of Object.entries(map)) {
        const rate = data.rates[apiKey];
        if (rate) {
          await this.prisma.exchangeRate.upsert({
            where: { currency: code },
            update: { rate },
            create: { currency: code, rate },
          });
        }
      }
      return this.prisma.exchangeRate.findMany();
    } catch (e) {
      throw new Error('No se pudieron obtener tasas: ' + (e as Error).message);
    }
  }

  private async seedDefaults() {
    const defaults = [
      { currency: 'COP', rate: 4200 },
      { currency: 'EUR', rate: 0.92 },
      { currency: 'MXN', rate: 17.50 },
    ];
    for (const d of defaults) {
      await this.prisma.exchangeRate.upsert({
        where: { currency: d.currency },
        update: { rate: d.rate },
        create: d,
      });
    }
  }
}
