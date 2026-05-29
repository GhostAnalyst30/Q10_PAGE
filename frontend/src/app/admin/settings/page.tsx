"use client";

import { useEffect, useState } from "react";
import { settingsService } from "@/services/settings.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Settings, RefreshCw, Save, Loader2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [rates, setRates] = useState<Array<{ currency: string; rate: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);

  function loadRates() {
    setLoading(true);
    settingsService.getRates().then((data) => {
      setRates(data);
      setLoading(false);
    }).catch(() => {
      toast.error("Error al cargar tasas");
      setLoading(false);
    });
  }

  useEffect(() => { loadRates() }, []);

  async function handleSave(currency: string) {
    setSaving(currency);
    const rate = rates.find((r) => r.currency === currency)?.rate;
    if (!rate || rate <= 0) {
      toast.error("La tasa debe ser mayor a 0");
      setSaving(null);
      return;
    }
    try {
      await settingsService.updateRate(currency, rate);
      toast.success(`Tasa ${currency} actualizada`);
    } catch {
      toast.error("Error al guardar");
    } finally {
      setSaving(null);
    }
  }

  async function handleFetch() {
    setFetching(true);
    try {
      const data = await settingsService.fetchRatesFromApi();
      setRates(data);
      toast.success("Tasas actualizadas desde la API");
    } catch {
      toast.error("Error al obtener tasas");
    } finally {
      setFetching(false);
    }
  }

  function updateRate(currency: string, value: string) {
    const num = parseFloat(value);
    if (isNaN(num)) return;
    setRates((prev) => prev.map((r) => r.currency === currency ? { ...r, rate: num } : r));
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          Configuración
        </h2>
        <Button variant="outline" size="sm" onClick={handleFetch} disabled={fetching} className="gap-1">
          {fetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Auto-detectar tasas
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tasas de Cambio (vs USD)</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
            </div>
          ) : (
            <div className="space-y-3">
              {rates.map((rate) => (
                <div key={rate.currency} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold w-12">{rate.currency}</span>
                    <span className="text-sm text-muted-foreground">1 USD =</span>
                    <input
                      type="number"
                      step="0.01"
                      value={rate.rate}
                      onChange={(e) => updateRate(rate.currency, e.target.value)}
                      className="w-32 h-9 rounded-lg border border-border bg-background px-3 text-sm text-right"
                    />
                  </div>
                  <Button
                    variant="gradient"
                    size="sm"
                    onClick={() => handleSave(rate.currency)}
                    disabled={saving === rate.currency}
                    className="gap-1"
                  >
                    {saving === rate.currency ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Save className="h-3 w-3" />
                    )}
                    Guardar
                  </Button>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-4">
            Estas tasas se usan para mostrar precios en múltiples monedas en el formulario de cursos y para convertir pagos PSE (COP).
            Puedes editarlas manualmente o presionar "Auto-detectar" para obtener las tasas actualizadas desde open.er-api.com.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
