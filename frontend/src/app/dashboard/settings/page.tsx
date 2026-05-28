"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/auth.service";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Sun, Moon, Loader2, Shield } from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user, refreshUser } = useAuth();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const [loadingPwd, setLoadingPwd] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [newEmail, setNewEmail] = useState(user?.email || "");
  const [adminKey, setAdminKey] = useState("");

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("La nueva contraseña debe tener al menos 8 caracteres");
      return;
    }
    setLoadingPwd(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      toast.success("Contraseña actualizada exitosamente");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.response?.data?.message?.[0] || err.response?.data?.message || "Error al cambiar contraseña");
    } finally {
      setLoadingPwd(false);
    }
  }

  async function handleChangeEmail(e: React.FormEvent) {
    e.preventDefault();
    setLoadingEmail(true);
    try {
      await authService.changeEmail(newEmail, adminKey);
      toast.success("Email actualizado exitosamente");
      refreshUser();
      setAdminKey("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error al cambiar email");
    } finally {
      setLoadingEmail(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold mb-6">Configuración</h2>

      <motion.div
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
      >
        {/* Change Password */}
        <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
        <Card>
          <CardHeader>
            <CardTitle>Cambiar Contraseña</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Contraseña actual</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nueva contraseña</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repite la nueva contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" variant="gradient" disabled={loadingPwd}>
                {loadingPwd ? <Loader2 className="h-4 w-4 animate-spin" /> : "Actualizar Contraseña"}
              </Button>
            </form>
          </CardContent>
        </Card>
        </motion.div>

        {/* Change Email (solo superadmin) */}
        {isSuperAdmin && (
          <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Cambiar Email del Superadmin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangeEmail} className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="newEmail">Nuevo email</Label>
                  <Input
                    id="newEmail"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminKey">Clave de seguridad (SUPER_ADMIN_KEY)</Label>
                  <Input
                    id="adminKey"
                    type="password"
                    placeholder="Ingresa tu clave de superadmin"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Esta clave está definida en el archivo <code>.env</code> como <code>SUPER_ADMIN_KEY</code>
                  </p>
                </div>
                <Button type="submit" variant="gradient" disabled={loadingEmail}>
                  {loadingEmail ? <Loader2 className="h-4 w-4 animate-spin" /> : "Actualizar Email"}
                </Button>
              </form>
            </CardContent>
          </Card>
          </motion.div>
        )}

        {/* Theme */}
        <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
        <Card>
          <CardHeader>
            <CardTitle>Apariencia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Tema Oscuro</p>
                <p className="text-sm text-muted-foreground">
                  Alterna entre modo claro y oscuro
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
