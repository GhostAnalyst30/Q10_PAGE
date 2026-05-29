import { Controller, Get, Patch, Post, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateRateDto } from './dto/update-rate.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get('rates/public')
  getPublicRates() {
    return this.settingsService.getRates();
  }

  @Get('rates')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  getRates() {
    return this.settingsService.getRates();
  }

  @Patch('rates')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  updateRate(@Body() dto: UpdateRateDto) {
    return this.settingsService.updateRate(dto.currency, dto.rate);
  }

  @Post('rates/fetch')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  fetchRates() {
    return this.settingsService.fetchRatesFromApi();
  }
}
