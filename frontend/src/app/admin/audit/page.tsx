"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { auditService, AuditLogEntry } from "@/services/audit.service";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { History, ChevronLeft, ChevronRight, RefreshCw, Shield, User, BookOpen, Mail, Key, Trash2, Undo2, Loader2 } from "lucide-react";

const undoableActions = ["create_course", "delete_course", "update_course", "update_role", "toggle_status", "create_user", "create_admin"];

const actionLabels: Record<string, { label: string; color: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" }> = {
  create_course: { label: "Curso Creado", color: "success" },
  update_course: { label: "Curso Actualizado", color: "default" },
  delete_course: { label: "Curso Eliminado", color: "destructive" },
  update_role: { label: "Rol Cambiado", color: "warning" },
  toggle_status: { label: "Estado Cambiado", color: "warning" },
  create_user: { label: "Usuario Creado", color: "success" },
  create_admin: { label: "Admin Creado", color: "default" },
  delete_user: { label: "Usuario Eliminado", color: "destructive" },
  send_credentials: { label: "Credenciales Enviadas", color: "secondary" },
  send_credentials_password: { label: "Credenciales+Pass Enviadas", color: "secondary" },
  send_q10_credentials: { label: "Credenciales Q10 Enviadas", color: "secondary" },
  update_q10_link: { label: "Link Q10 Actualizado", color: "default" },
  update_q10_credentials: { label: "Credenciales Q10 Actualizadas", color: "default" },
};

function getActionIcon(action: string) {
  if (action.includes("credential") || action.includes("q10")) return Mail;
  if (action.includes("delete")) return Trash2;
  if (action.includes("role") || action.includes("status")) return Shield;
  if (action.includes("course")) return BookOpen;
  return Key;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminAuditPage() {
  const { user } = useAuth();
  const [data, setData] = useState<{ data: AuditLogEntry[]; meta: any } | null>(null);
  const [loading, setLoading] = useState(true);
  const [undoing, setUndoing] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [entityFilter, setEntityFilter] = useState("");

  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  function loadLogs() {
    setLoading(true);
    auditService.getAll({ page, limit: 50, entity: entityFilter || undefined }).then((res) => {
      setData(res);
      setLoading(false);
    });
  }

  useEffect(() => { loadLogs() }, [page, entityFilter]);

  async function handleUndo(entryId: string) {
    setUndoing(entryId);
    try {
      await api.post(`/audit/${entryId}/undo`);
      toast.success("Acción deshecha exitosamente");
      loadLogs();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error al deshacer");
    } finally {
      setUndoing(null);
    }
  }

  function canUndo(entry: AuditLogEntry) {
    if (!undoableActions.includes(entry.action)) return false;
    if (entry.userId !== user?.id && user?.role !== "SUPER_ADMIN") return false;
    return true;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <History className="h-6 w-6 text-primary" />
          Historial de Cambios
        </h2>
        <Button variant="outline" size="sm" onClick={loadLogs} disabled={loading} className="gap-1">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Actualizar
        </Button>
      </div>

      {!isSuperAdmin && (
        <p className="text-sm text-muted-foreground mb-4">Mostrando solo los cambios que realizaste.</p>
      )}

      <div className="flex gap-2 mb-4">
        <select
          value={entityFilter}
          onChange={(e) => { setEntityFilter(e.target.value); setPage(1); }}
          className="h-9 rounded-xl border border-border bg-background px-3 text-sm"
        >
          <option value="">Todas las entidades</option>
          <option value="course">Cursos</option>
          <option value="user">Usuarios</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : data?.data.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <History className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Sin cambios registrados</h3>
            <p className="text-sm text-muted-foreground">Aún no hay actividad en el sistema.</p>
          </CardContent>
        </Card>
      ) : (
        <motion.div className="space-y-2" initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.02 } } }}>
          {data?.data.map((entry) => {
            const actionInfo = actionLabels[entry.action] || { label: entry.action, color: "outline" as const };
            const Icon = getActionIcon(entry.action);
            const isUndoable = canUndo(entry);
            return (
              <motion.div key={entry.id} variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}>
                <Card>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant={actionInfo.color} className="text-xs">{actionInfo.label}</Badge>
                          <span className="text-xs text-muted-foreground">{formatDate(entry.createdAt)}</span>
                        </div>
                        <p className="text-sm mt-1 truncate max-w-xl">{entry.details}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">por</span>
                          <span className="text-xs font-medium">{entry.userName}</span>
                          <Badge variant="outline" className="text-[10px]">{entry.userRole}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <Badge variant="outline" className="text-xs">{entry.entity}</Badge>
                      {isUndoable && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUndo(entry.id)}
                          disabled={undoing === entry.id}
                          className="gap-1 text-xs"
                        >
                          {undoing === entry.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Undo2 className="h-3 w-3" />
                          )}
                          Deshacer
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {data?.meta && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button variant="outline" size="sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {page} de {data.meta.totalPages}
          </span>
          <Button variant="outline" size="sm" onClick={() => setPage(Math.min(data.meta.totalPages, page + 1))} disabled={page === data.meta.totalPages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </motion.div>
  );
}
