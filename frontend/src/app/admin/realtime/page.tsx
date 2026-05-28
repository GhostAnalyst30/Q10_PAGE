"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { Users, BookOpen, DollarSign, ShoppingCart, Activity, UserCheck, UserX, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function AdminRealtimePage() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const [stats, setStats] = useState<any>(null);
  const [comparison, setComparison] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    if (!isSuperAdmin) return;
    loadData();
  }, [isSuperAdmin]);

  async function loadData() {
    try {
      const [statsData, compData] = await Promise.all([
        adminService.getStats(),
        adminService.getUsersComparison(),
      ]);
      setStats(statsData);
      setComparison(compData);
      setLastUpdate(new Date());
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }

  if (!isSuperAdmin) return null;

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="h-6 w-6 text-green-400" />
          <h2 className="text-2xl font-bold">Monitor</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading} className="gap-1">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
          <span className="text-xs text-muted-foreground">
            {lastUpdate.toLocaleTimeString("es-CO")}
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={lastUpdate.getTime()}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-green-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Usuarios Totales</p>
                    <motion.p
                      key={stats.totalUsers}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="text-2xl font-bold mt-1"
                    >
                      {stats.totalUsers}
                    </motion.p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-600/20 to-green-600/10">
                    <Users className="h-6 w-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Cursos</p>
                    <p className="text-2xl font-bold mt-1">{stats.totalCourses}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600/20 to-purple-600/10">
                    <BookOpen className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Ingresos Totales</p>
                    <p className="text-2xl font-bold mt-1">{formatPrice(stats.totalRevenue)}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-600/10">
                    <DollarSign className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Inscripciones</p>
                    <p className="text-2xl font-bold mt-1">{stats.totalEnrollments}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-600/20 to-yellow-600/10">
                    <ShoppingCart className="h-6 w-6 text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Registered vs Unregistered */}
          {comparison && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-green-400" />
                    Registrados vs No Registrados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-green-500/10">
                      <div className="flex items-center gap-3">
                        <UserCheck className="h-5 w-5 text-green-400" />
                        <span className="text-sm font-medium">Total Usuarios</span>
                      </div>
                      <span className="text-lg font-bold">{comparison.total}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-blue-500/10">
                      <div className="flex items-center gap-3">
                        <UserCheck className="h-5 w-5 text-blue-400" />
                        <span className="text-sm font-medium">Usuarios Activos</span>
                      </div>
                      <span className="text-lg font-bold">{comparison.active}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-green-500/10">
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-5 w-5 text-green-400" />
                        <span className="text-sm font-medium">Con Cursos Comprados</span>
                      </div>
                      <span className="text-lg font-bold">{comparison.withEnrollments}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-yellow-500/10">
                      <div className="flex items-center gap-3">
                        <UserX className="h-5 w-5 text-yellow-400" />
                        <span className="text-sm font-medium">Sin Cursos (no registrados en cursos)</span>
                      </div>
                      <span className="text-lg font-bold">{comparison.withoutEnrollments}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-purple-400" />
                    Últimos Registros
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.recentUsers.map((u: any) => (
                      <div key={u.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-xs font-bold text-white">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{u.name}</p>
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                        <Badge variant={u.role === "SUPER_ADMIN" ? "default" : u.role === "ADMIN" ? "secondary" : "outline"} className="text-xs">
                          {u.role}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Top Courses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-400" />
                Cursos Más Vendidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.topCourses.map((item: any, i: number) => (
                  <div key={item.course.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-sm font-bold">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{item.course.title}</p>
                        <p className="text-xs text-muted-foreground">{formatPrice(item.course.price)}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium">{item.enrollments} ventas</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cart Items */}
          {stats.totalCartItems !== undefined && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="h-5 w-5 text-yellow-400" />
                    <span className="text-sm font-medium">Artículos en Carritos</span>
                  </div>
                  <span className="text-2xl font-bold">{stats.totalCartItems}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
