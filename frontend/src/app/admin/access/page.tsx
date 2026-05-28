"use client";

import { useState } from "react";
import { adminService } from "@/services/admin.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyConfirmDialog } from "@/components/admin/key-confirm-dialog";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { Shield, Loader2, UserCog, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminAccessPage() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ADMIN");
  const [loading, setLoading] = useState(false);
  const [keyDialogOpen, setKeyDialogOpen] = useState(false);

  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSuperAdmin) {
      setKeyDialogOpen(true);
    } else {
      handleCreateAdmin();
    }
  }

  async function handleCreateAdmin(key?: string) {
    setLoading(true);
    try {
      await adminService.createAdmin(name, email, password, role, key);
      toast.success("Administrador creado exitosamente");
      setName("");
      setEmail("");
      setPassword("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error al crear administrador");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold mb-6">Gestión de Accesos</h2>

      {isSuperAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl bg-muted border border-border"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Solo Superadmin</p>
              <p className="text-xs text-muted-foreground mt-1">
                Esta sección permite crear nuevos administradores. Se requiere la clave de seguridad del superadmin.
                El Superadmin no puede ser eliminado ni degradado por ningún otro usuario.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Crear Nuevo Administrador
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="ADMIN">ADMIN</option>
                {isSuperAdmin && <option value="SUPER_ADMIN">SUPER_ADMIN</option>}
              </select>
            </div>
            <Button type="submit" variant="gradient" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Crear Administrador"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isSuperAdmin && (
        <KeyConfirmDialog
          open={keyDialogOpen}
          onOpenChange={setKeyDialogOpen}
          onConfirm={handleCreateAdmin}
          title="Crear nuevo administrador"
          description="Ingresa la clave de superadmin para crear este nuevo administrador"
        />
      )}
    </motion.div>
  );
}
