"use client";

import { useEffect, useState } from "react";
import { User, PaginatedResponse } from "@/types";
import { adminService } from "@/services/admin.service";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { KeyConfirmDialog } from "@/components/admin/key-confirm-dialog";
import toast from "react-hot-toast";
import { Search, Shield, Ban, CheckCircle, Trash2, Mail, Users, UserCheck, UserX, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [data, setData] = useState<PaginatedResponse<User> | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [keyDialogOpen, setKeyDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<{ title: string; desc: string; action: (key: string) => Promise<void> }>();
  const [comparison, setComparison] = useState<any>(null);

  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  function loadUsers() {
    setLoading(true);
    adminService.getUsers({ page, limit: 20, search: search || undefined }).then((res) => {
      setData(res);
      setLoading(false);
    });
  }

  useEffect(() => {
    loadUsers();
    if (isSuperAdmin) {
      adminService.getUsersComparison().then(setComparison);
    }
  }, [page]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    loadUsers();
  }

  function confirmAction(title: string, desc: string, action: (key: string) => Promise<void>) {
    setDialogAction({ title, desc, action });
    setKeyDialogOpen(true);
  }

  async function toggleStatus(userId: string) {
    confirmAction(
      "Cambiar estado de usuario",
      "Ingresa la clave de seguridad para cambiar el estado del usuario",
      async (key) => {
        try {
          await adminService.toggleUserStatus(userId, key);
          toast.success("Estado actualizado");
          loadUsers();
        } catch (err: any) {
          toast.error(err.response?.data?.message || "Error");
          throw err;
        }
      }
    );
  }

  async function changeRole(userId: string, role: string) {
    confirmAction(
      "Cambiar rol de usuario",
      "Ingresa la clave de seguridad para cambiar el rol del usuario",
      async (key) => {
        try {
          await adminService.updateUserRole(userId, role, key);
          toast.success("Rol actualizado");
          loadUsers();
        } catch (err: any) {
          toast.error(err.response?.data?.message || "Error");
          throw err;
        }
      }
    );
  }

  async function deleteUser(userId: string) {
    confirmAction(
      "Eliminar usuario",
      "Esta acción es irreversible. Ingresa la clave de superadmin para confirmar",
      async (key) => {
        try {
          await adminService.deleteUser(userId, key);
          toast.success("Usuario eliminado permanentemente");
          loadUsers();
        } catch (err: any) {
          toast.error(err.response?.data?.message || "Error");
          throw err;
        }
      }
    );
  }

  async function sendCredentials(userId: string) {
    confirmAction(
      "Enviar credenciales",
      "Se enviará un correo con las credenciales de acceso al usuario",
      async (key) => {
        try {
          await adminService.sendCredentials(userId, key);
          toast.success("Credenciales enviadas por correo");
        } catch (err: any) {
          toast.error(err.response?.data?.message || "Error");
          throw err;
        }
      }
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <h2 className="text-2xl font-bold mb-6">Gestión de Usuarios</h2>

      {/* Registered vs Unregistered */}
      {isSuperAdmin && comparison && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Users className="h-8 w-8 text-purple-400" />
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-xl font-bold">{comparison.total}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <UserCheck className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-xs text-muted-foreground">Activos</p>
                <p className="text-xl font-bold">{comparison.active}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-xs text-muted-foreground">Con Cursos</p>
                <p className="text-xl font-bold">{comparison.withEnrollments}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <UserX className="h-8 w-8 text-yellow-400" />
              <div>
                <p className="text-xs text-muted-foreground">Sin Cursos</p>
                <p className="text-xl font-bold">{comparison.withoutEnrollments}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuarios..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" variant="gradient" size="sm">Buscar</Button>
      </form>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {data?.data.map((u) => (
            <Card key={u.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-sm font-bold text-white">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant={u.role === "SUPER_ADMIN" ? "default" : u.role === "ADMIN" ? "secondary" : "outline"} className="text-xs">
                        {u.role === "SUPER_ADMIN" ? "SUPER ADMIN" : u.role}
                      </Badge>
                      <Badge variant={u.isActive ? "success" : "destructive"} className="text-xs">
                        {u.isActive ? "Activo" : "Suspendido"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => sendCredentials(u.id)}
                    title="Enviar credenciales"
                    className="text-xs gap-1"
                  >
                    <Mail className="h-3 w-3" />
                    Credenciales
                  </Button>
                  {u.role !== "SUPER_ADMIN" && (
                    <>
                      <select
                        value={u.role}
                        onChange={(e) => changeRole(u.id, e.target.value)}
                        className="h-8 rounded-lg border border-border bg-background px-2 text-xs"
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleStatus(u.id)}
                        title={u.isActive ? "Suspender" : "Activar"}
                      >
                        {u.isActive ? (
                          <Ban className="h-4 w-4 text-red-400" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        )}
                      </Button>
                      {isSuperAdmin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteUser(u.id)}
                          title="Eliminar usuario"
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {data?.meta && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button variant="outline" size="sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {page} de {data.meta.totalPages}
          </span>
          <Button variant="outline" size="sm" onClick={() => setPage(Math.min(data.meta.totalPages, page + 1))} disabled={page === data.meta.totalPages}>
            Siguiente
          </Button>
        </div>
      )}

      <KeyConfirmDialog
        open={keyDialogOpen}
        onOpenChange={setKeyDialogOpen}
        onConfirm={async (key) => {
          if (dialogAction) {
            await dialogAction.action(key);
          }
        }}
        title={dialogAction?.title || "Confirmar identidad"}
        description={dialogAction?.desc || "Ingresa la clave de seguridad para continuar"}
      />
    </motion.div>
  );
}
