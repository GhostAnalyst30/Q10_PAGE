"use client";

import { useCurrency } from "@/lib/currency-context";
import { DollarSign } from "lucide-react";

export function CurrencyToggle() {
  const { currency, toggle } = useCurrency();

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-accent transition-colors"
      title={`Mostrar en ${currency === "USD" ? "COP" : "USD"}`}
    >
      <DollarSign className="h-3.5 w-3.5" />
      <span className={currency === "COP" ? "text-green-400" : "text-blue-400"}>
        {currency}
      </span>
    </button>
  );
}
