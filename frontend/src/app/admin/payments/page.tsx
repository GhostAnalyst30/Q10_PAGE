"use client";

import { useEffect, useState } from "react";
import { Payment, PaginatedResponse } from "@/types";
import { adminService } from "@/services/admin.service";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";

export default function AdminPaymentsPage() {
  const [data, setData] = useState<PaginatedResponse<Payment> | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    setLoading(true);
    adminService.getPayments({ limit: 50, status: statusFilter || undefined }).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [statusFilter]);

  const statusVariant: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
    APPROVED: "success",
    PENDING: "warning",
    REJECTED: "destructive",
    REFUNDED: "secondary",
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gestión de Pagos</h2>

      <div className="flex gap-2 mb-6">
        {["", "APPROVED", "PENDING", "REJECTED"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              statusFilter === status
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {status ? (status === "APPROVED" ? "Aprobados" : status === "PENDING" ? "Pendientes" : "Rechazados") : "Todos"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
        </div>
      ) : (
        <div className="space-y-2">
          {data?.data.map((payment) => (
            <Card key={payment.id}>
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
          ))}
        </div>
      )}
    </div>
  );
}
