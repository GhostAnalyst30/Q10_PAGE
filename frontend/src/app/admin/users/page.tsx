"use client";

import { useEffect, useState } from "react";
import { User, PaginatedResponse } from "@/types";
import { adminService } from "@/services/admin.service";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { KeyConfirmDialog } from "@/components/admin/key-confirm-dialog";
import toast from "react-hot-toast";
import { Search, Shield, Ban, CheckCircle, Trash2, Mail, Users, UserCheck, UserX, BookOpen, ChevronDown, ChevronUp, ExternalLink, Key } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [data, setData] = useState<PaginatedResponse<User> | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [keyDialogOpen, setKeyDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<{ title: string; desc: string; action: (key: string) => Promise<void> }>();
  const [comparison, setComparison] = useState<any>(null);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [q10UserInput, setQ10UserInput] = useState("");
  const [q10PassInput, setQ10PassInput] = useState("");
  const [credPasswordInput, setCredPasswordInput] = useState("");

  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  function loadUsers(pageNum?: number, searchTerm?: string) {
    setLoading(true);
    adminService.getUsers({ page: pageNum, limit: 20, search: searchTerm || undefined }).then((res) => {
      setData(res);
      setLoading(false);
    });
  }

  useEffect(() => {
    loadUsers(page, search);
    if (isSuperAdmin) {
      adminService.getUsersComparison().then(setComparison);
    }
  }, [page, search]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    loadUsers(1, search);
  }

  function confirmAction(title: string, desc: string, action: (key: string) => Promise<void>) {
    setDialogAction({ title, desc, action });
    setKeyDialogOpen(true);
  }

  function toggleUser(user: User) {
    if (expandedUser === user.id) {
      setExpandedUser(null);
    } else {
      setExpandedUser(user.id);
      setQ10UserInput(user.q10User || "");
      setQ10PassInput(user.q10Pass || "");
      setCredPasswordInput("");
    }
  }

  async function sendCredentials(userId: string) {
    confirmAction(
      "Enviar credenciales de la página",
      "Se enviará un correo con el email de acceso al usuario",
      async (key) => {
        try {
          await adminService.sendCredentials(userId, key);
          toast.success("Credenciales de página enviadas");
        } catch (err: any) {
          toast.error(err.response?.data?.message || "Error");
          throw err;
        }
      }
    );
  }

  async function sendCredentialsWithPassword(userId: string) {
    if (!credPasswordInput) {
      toast.error("Ingresa una contraseña para enviar");
      return;
    }
    confirmAction(
      "Enviar credenciales con contraseña",
      "Se enviará un correo con email y contraseña al usuario",
      async (key) => {
        try {
          await adminService.sendCredentialsWithPassword(userId, credPasswordInput, key);
          toast.success("Credenciales con contraseña enviadas");
        } catch (err: any) {
          toast.error(err.response?.data?.message || "Error");
          throw err;
        }
      }
    );
  }

  async function saveQ10Credentials(userId: string) {
    confirmAction(
      "Guardar credenciales Q10",
      "Se actualizarán las credenciales de Q10 del usuario",
      async (key) => {
        try {
          await adminService.updateQ10UserCredentials(userId, q10UserInput, q10PassInput, key);
          toast.success("Credenciales Q10 actualizadas");
          loadUsers();
        } catch (err: any) {
          toast.error(err.response?.data?.message || "Error");
          throw err;
        }
      }
    );
  }

  async function sendQ10Credentials(userId: string) {
    confirmAction(
      "Enviar credenciales Q10",
      "Se enviará un correo con las credenciales de Q10 al usuario",
      async (key) => {
        try {
          await adminService.sendQ10Credentials(userId, key);
          toast.success("Credenciales Q10 enviadas por correo");
        } catch (err: any) {
          toast.error(err.response?.data?.message || "Error");
          throw err;
        }
      }
    );
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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <h2 className="text-2xl font-bold mb-6">Gestión de Usuarios</h2>

      {/* Registered vs Unregistered */}
      {isSuperAdmin && comparison && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-xl font-bold">{comparison.total}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <UserCheck className="h-8 w-8 text-primary" />
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
              <UserX className="h-8 w-8 text-muted-foreground" />
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
          <Input placeholder="Buscar usuarios..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
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
        <motion.div className="space-y-2" initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.03 } } }}>
          {data?.data.map((u) => (
            <motion.div key={u.id} variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} whileHover={{ scale: 1.01, boxShadow: "0 0 20px rgba(0, 87, 255, 0.08)" }}>
            <Card>
              <CardContent className="p-0">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
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
                        {isSuperAdmin && (
                          <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                            Q10: {u.q10User ? "✓" : "✗"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => toggleUser(u)} title="Ver más opciones" className="text-xs gap-1">
                      {expandedUser === u.id ? (
                        <><ChevronUp className="h-3 w-3" /> Cerrar</>
                      ) : (
                        <><ChevronDown className="h-3 w-3" /> Opciones</>
                      )}
                    </Button>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedUser === u.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-border/50 overflow-hidden">
                      <div className="p-4 space-y-4">
                        {/* Row 1: Credenciales de la página */}
                        <div>
                          <h4 className="text-sm font-semibold text-primary mb-2 flex items-center gap-1">
                            <Shield className="h-4 w-4" /> Credenciales de la Página
                          </h4>
                          <div className="flex flex-wrap items-center gap-2">
                            <Input
                              placeholder="Contraseña opcional para incluir en el correo"
                              type="password"
                              value={credPasswordInput}
                              onChange={(e) => setCredPasswordInput(e.target.value)}
                              className="h-8 w-56 text-xs"
                            />
                            <Button variant="outline" size="sm" className="text-xs gap-1" onClick={() => sendCredentials(u.id)}>
                              <Mail className="h-3 w-3" /> Enviar solo email
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs gap-1" onClick={() => sendCredentialsWithPassword(u.id)}>
                              <Mail className="h-3 w-3" /> Enviar con contraseña
                            </Button>
                          </div>
                        </div>

                        {/* Row 2: Credenciales Q10 */}
                        {isSuperAdmin && (
                          <div>
                            <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                              <Key className="h-4 w-4" /> Credenciales Q10
                            </h4>
                            <div className="flex flex-wrap items-center gap-2">
                              <Input
                                placeholder="Usuario Q10"
                                value={q10UserInput}
                                onChange={(e) => setQ10UserInput(e.target.value)}
                                className="h-8 w-40 text-xs"
                              />
                              <Input
                                placeholder="Contraseña Q10"
                                type="password"
                                value={q10PassInput}
                                onChange={(e) => setQ10PassInput(e.target.value)}
                                className="h-8 w-40 text-xs"
                              />
                              <Button variant="outline" size="sm" className="text-xs gap-1" onClick={() => saveQ10Credentials(u.id)} disabled={!q10UserInput || !q10PassInput}>
                                <Key className="h-3 w-3" /> Guardar
                              </Button>
                              <Button variant="outline" size="sm" className="text-xs gap-1" onClick={() => sendQ10Credentials(u.id)}>
                                <ExternalLink className="h-3 w-3" /> Enviar Q10
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Row 3: Acciones admin */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/30">
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
                              <Button variant="ghost" size="sm" onClick={() => toggleStatus(u.id)} title={u.isActive ? "Suspender" : "Activar"} className="text-xs gap-1">
                                {u.isActive ? <Ban className="h-3 w-3 text-muted-foreground" /> : <CheckCircle className="h-3 w-3 text-primary" />}
                                {u.isActive ? "Suspender" : "Activar"}
                              </Button>
                              {isSuperAdmin && (
                                <Button variant="ghost" size="sm" onClick={() => deleteUser(u.id)} title="Eliminar usuario" className="text-xs gap-1 text-muted-foreground">
                                  <Trash2 className="h-3 w-3" /> Eliminar
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {data?.meta && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button variant="outline" size="sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>Anterior</Button>
          <span className="text-sm text-muted-foreground">Página {page} de {data.meta.totalPages}</span>
          <Button variant="outline" size="sm" onClick={() => setPage(Math.min(data.meta.totalPages, page + 1))} disabled={page === data.meta.totalPages}>Siguiente</Button>
        </div>
      )}

      <KeyConfirmDialog
        open={keyDialogOpen}
        onOpenChange={setKeyDialogOpen}
        onConfirm={async (key) => { if (dialogAction) await dialogAction.action(key); }}
        title={dialogAction?.title || "Confirmar identidad"}
        description={dialogAction?.desc || "Ingresa la clave de seguridad para continuar"}
      />
    </motion.div>
  );
}
