"use client";

import { useEffect, useState } from "react";
import { Payment } from "@/types";
import { paymentsService } from "@/services/payments.service";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import { CreditCard } from "lucide-react";

export default function PurchasesPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    paymentsService.getMyPayments().then((data) => {
      setPayments(data);
      setLoading(false);
    });
  }, []);

  const statusVariant: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
    APPROVED: "success",
    PENDING: "warning",
    REJECTED: "destructive",
    REFUNDED: "secondary",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold mb-6">Historial de Compras</h2>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : payments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No hay compras registradas</p>
          </CardContent>
        </Card>
        </motion.div>
      ) : (
        <motion.div
          className="space-y-3"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
        >
          {payments.map((payment) => (
            <motion.div
              key={payment.id}
              variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ scale: 1.01, boxShadow: "0 0 20px rgba(0, 87, 255, 0.08)" }}
            >
            <Card>
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="font-semibold">
                    {formatPrice(payment.amount, payment.currency)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(payment.createdAt).toLocaleDateString("es-CO", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  {payment.gateway && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Gateway: {payment.gateway}
                    </p>
                  )}
                </div>
                <Badge variant={statusVariant[payment.status] || "secondary"}>
                  {payment.status === "APPROVED"
                    ? "Aprobado"
                    : payment.status === "PENDING"
                    ? "Pendiente"
                    : payment.status === "REJECTED"
                    ? "Rechazado"
                    : "Reembolsado"}
                </Badge>
              </CardContent>
            </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
