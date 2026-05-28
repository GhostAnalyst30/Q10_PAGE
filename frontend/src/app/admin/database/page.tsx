"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { Database, Table, HardDrive, RefreshCw, CheckCircle, XCircle } from "lucide-react";

export default function AdminDatabasePage() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSuperAdmin) return;
    adminService.getStats().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, [isSuperAdmin]);

  if (!isSuperAdmin) return null;

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const tables = [
    {
      name: "Usuarios",
      icon: Table,
      count: stats.totalUsers,
      description: "Registros de usuarios en la plataforma",
      color: "bg-primary/10",
    },
    {
      name: "Cursos",
      icon: Table,
      count: stats.totalCourses,
      description: "Cursos activos disponibles",
      color: "bg-primary/10",
    },
    {
      name: "Inscripciones",
      icon: Table,
      count: stats.totalEnrollments,
      description: "Inscripciones aprobadas",
      color: "bg-primary/10",
    },
    {
      name: "Pagos (Ingresos)",
      icon: HardDrive,
      count: `$${stats.totalRevenue.toLocaleString("es-CO")}`,
      description: "Total de ingresos generados",
      color: "bg-primary/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Database className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Información de la Base de Datos</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {tables.map((table) => (
          <Card key={table.name}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${table.color}`}>
                  <table.icon className="h-6 w-6" />
                </div>
                <Badge variant="success" className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Online
                </Badge>
              </div>
              <h3 className="text-lg font-semibold">{table.name}</h3>
              <p className="text-3xl font-bold mt-2">{table.count}</p>
              <p className="text-xs text-muted-foreground mt-1">{table.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-primary" />
            Estado del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Base de Datos PostgreSQL</span>
              </div>
              <Badge variant="success">Conectada</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Servidor API</span>
              </div>
              <Badge variant="success">Operativo</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Servicio de Correos (Resend)</span>
              </div>
              <Badge variant="success">Activo</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5">
              <div className="flex items-center gap-3">
                <RefreshCw className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Última sincronización</span>
              </div>
              <span className="text-sm font-medium">En tiempo real</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
