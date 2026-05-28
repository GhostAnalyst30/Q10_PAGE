"use client";

import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { user } = useAuth();

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    try {
      await api.patch("/users/me", {
        name: form.get("name"),
        email: form.get("email"),
      });
      toast.success("Perfil actualizado");
    } catch {
      toast.error("Error al actualizar el perfil");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold mb-6">Mi Perfil</h2>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdate} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                name="name"
                defaultValue={user?.name}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={user?.email}
                required
              />
            </div>
            <motion.div whileTap={{ scale: 0.97 }}>
            <Button type="submit" variant="gradient">
              Guardar Cambios
            </Button>
            </motion.div>
          </form>

          <Separator className="my-6" />

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Rol:</span>{" "}
              {user?.role === "SUPER_ADMIN"
                ? "Super Admin"
                : user?.role === "ADMIN"
                ? "Administrador"
                : "Usuario"}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Miembro desde:</span>{" "}
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("es-CO")
                : "-"}
            </p>
          </div>
        </CardContent>
      </Card>
      </motion.div>
    </motion.div>
  );
}
