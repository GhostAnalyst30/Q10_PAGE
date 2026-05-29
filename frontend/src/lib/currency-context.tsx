"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import api from "@/lib/api";

export const DEFAULT_COP_RATE = 4200;
export const DEFAULT_EUR_RATE = 0.92;
export const DEFAULT_MXN_RATE = 17.50;

export type CurrencyCode = "USD" | "COP" | "EUR" | "MXN";

interface RateStore {
  COP: number;
  EUR: number;
  MXN: number;
}

let ratesStore: RateStore = { COP: DEFAULT_COP_RATE, EUR: DEFAULT_EUR_RATE, MXN: DEFAULT_MXN_RATE };

export function getRate(code: CurrencyCode): number {
  if (code === "USD") return 1;
  return ratesStore[code] ?? 1;
}

export function convertPrice(amount: number, from: CurrencyCode, to: CurrencyCode): number {
  if (from === to) return amount;
  const usd = from === "USD" ? amount : amount / getRate(from);
  if (to === "USD") return usd;
  return usd * getRate(to);
}

export function useRates() {
  return { COP: ratesStore.COP, EUR: ratesStore.EUR, MXN: ratesStore.MXN };
}

type Currency = "USD" | "COP";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  toggle: () => void;
  format: (priceInUSD: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("COP");

  useEffect(() => {
    api.get("/settings/rates/public").then((res) => {
      const data = res.data as Array<{ currency: string; rate: number }>;
      for (const r of data) {
        if (r.currency === "COP") ratesStore.COP = r.rate;
        else if (r.currency === "EUR") ratesStore.EUR = r.rate;
        else if (r.currency === "MXN") ratesStore.MXN = r.rate;
      }
    }).catch(() => {});
  }, []);

  const toggle = useCallback(() => {
    setCurrency((prev) => (prev === "USD" ? "COP" : "USD"));
  }, []);

  const format = useCallback(
    (priceInUSD: number) => {
      const value = currency === "COP" ? priceInUSD * ratesStore.COP : priceInUSD;
      return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
      }).format(value);
    },
    [currency]
  );

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, toggle, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
