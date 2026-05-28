"use client";

import { useState } from "react";
import { adminService } from "@/services/admin.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyConfirmDialog } from "@/components/admin/key-confirm-dialog";
import toast from "react-hot-toast";
import { UserPlus, Loader2 } from "lucide-react";

export default function AdminCreateUserPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [keyDialogOpen, setKeyDialogOpen] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setKeyDialogOpen(true);
  }

  async function handleCreateUser(key: string) {
    setLoading(true);
    try {
      await adminService.createUser(name, email, password, key);
      toast.success("Usuario creado exitosamente");
      setName("");
      setEmail("");
      setPassword("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error al crear usuario");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Crear Nuevo Usuario</h2>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Registrar Usuario en la Plataforma
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
            </div>
            <Button type="submit" variant="gradient" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Crear Usuario"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <KeyConfirmDialog
        open={keyDialogOpen}
        onOpenChange={setKeyDialogOpen}
        onConfirm={handleCreateUser}
        title="Crear nuevo usuario"
        description="Ingresa la clave de superadmin para crear este usuario"
      />
    </div>
  );
}
