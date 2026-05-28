"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { authService } from "@/services/auth.service";
import toast from "react-hot-toast";
import { BookOpen, Loader2, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setSent(true);
      toast.success("Correo enviado si el email existe");
    } catch {
      toast.error("Error al enviar el correo");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-10">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Correo Enviado</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Si el email está registrado, recibirás instrucciones para restablecer tu contraseña.
            </p>
            <Link href="/login">
              <Button variant="outline">Volver al inicio de sesión</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 mb-4">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl">Recuperar Contraseña</CardTitle>
          <CardDescription>
            Te enviaremos un enlace para restablecer tu contraseña
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              variant="gradient"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Enviar Instrucciones"
              )}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            <Link
              href="/login"
              className="text-purple-400 hover:text-purple-300"
            >
              Volver al inicio de sesión
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
