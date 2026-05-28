"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export const COP_RATE = 4200;

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

  const toggle = useCallback(() => {
    setCurrency((prev) => (prev === "USD" ? "COP" : "USD"));
  }, []);

  const format = useCallback(
    (priceInUSD: number) => {
      const value = currency === "COP" ? priceInUSD * COP_RATE : priceInUSD;
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
