"use client";

import { useEffect, useState } from "react";
import { Payment, PaginatedResponse } from "@/types";
import { adminService } from "@/services/admin.service";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminPaymentsPage() {
  const [data, setData] = useState<PaginatedResponse<Payment> | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const totalPages = data?.meta?.totalPages || 1;

  useEffect(() => {
    setLoading(true);
    adminService.getPayments({ page, limit: 20, status: statusFilter || undefined }).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [statusFilter, page]);

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
      <h2 className="text-2xl font-bold mb-6">Gestión de Pagos</h2>

      <motion.div
        className="flex gap-2 mb-6"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.3 }}
      >
        {["", "APPROVED", "PENDING", "REJECTED"].map((status) => (
          <motion.button
            key={status}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              statusFilter === status
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {status ? (status === "APPROVED" ? "Aprobados" : status === "PENDING" ? "Pendientes" : "Rechazados") : "Todos"}
          </motion.button>
        ))}
      </motion.div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
        </div>
      ) : (
        <motion.div
          className="space-y-2"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.03 } } }}
        >
          {data?.data.map((payment) => (
            <motion.div
              key={payment.id}
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ scale: 1.01, boxShadow: "0 0 20px rgba(0, 87, 255, 0.08)" }}
            >
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-semibold">{formatPrice(payment.amount, payment.currency)}</p>
                  <p className="text-xs text-muted-foreground">
                    {payment.user?.name} - {payment.user?.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(payment.createdAt).toLocaleDateString("es-CO", {
                      year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                  {payment.transactionId && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Transacción: {payment.transactionId}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <Badge variant={statusVariant[payment.status] || "secondary"}>
                    {payment.status === "APPROVED" ? "Aprobado" : payment.status === "PENDING" ? "Pendiente" : payment.status === "REJECTED" ? "Rechazado" : "Reembolsado"}
                  </Badge>
                  {payment.gateway && (
                    <p className="text-xs text-muted-foreground mt-1">{payment.gateway}</p>
                  )}
                </div>
              </CardContent>
            </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {!loading && totalPages > 1 && (
        <motion.div
          className="flex items-center justify-center gap-2 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <Button variant="outline" size="sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {page} de {totalPages}
          </span>
          <Button variant="outline" size="sm" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
