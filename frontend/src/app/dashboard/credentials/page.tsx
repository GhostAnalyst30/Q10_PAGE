"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { enrollmentsService } from "@/services/enrollments.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, Key, ExternalLink, Eye, EyeOff, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import type { Enrollment } from "@/types";

export default function CredentialsPage() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQ10Pass, setShowQ10Pass] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    enrollmentsService.getMyCourses().then((data) => {
      setEnrollments(data);
      setLoading(false);
    });
  }, []);

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copiado al portapapeles");
    setTimeout(() => setCopied(false), 2000);
  }

  if (!user) return null;

  const approvedEnrollments = enrollments.filter(e => e.paymentStatus === "APPROVED" && e.accessGranted);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <h2 className="text-2xl font-bold mb-6">Mis Credenciales</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Credenciales de la Página */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-primary" />
              Credenciales de la Plataforma
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Email</p>
              <div className="flex items-center gap-2">
                <code className="px-3 py-2 bg-muted rounded-lg text-sm flex-1">{user.email}</code>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(user.email)}>
                  {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Contraseña</p>
              <p className="text-sm text-muted-foreground">
                Puedes cambiar tu contraseña en{" "}
                <a href="/dashboard/settings" className="text-primary hover:underline">Configuración</a>
              </p>
            </div>
            <div className="pt-2">
              <a href="/dashboard/settings">
                <Button variant="outline" size="sm">Cambiar Contraseña</Button>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Credenciales Q10 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Key className="h-5 w-5 text-muted-foreground" />
              Credenciales Q10
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.q10User ? (
              <>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Usuario Q10</p>
                  <div className="flex items-center gap-2">
                    <code className="px-3 py-2 bg-muted rounded-lg text-sm flex-1">{user.q10User}</code>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(user.q10User!)}>
                      {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Contraseña Q10</p>
                  <div className="flex items-center gap-2">
                    <code className="px-3 py-2 bg-muted rounded-lg text-sm flex-1">
                      {showQ10Pass ? user.q10Pass : "••••••••"}
                    </code>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowQ10Pass(!showQ10Pass)}>
                      {showQ10Pass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(user.q10Pass!)}>
                      {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-6 text-center">
                <Key className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No tienes credenciales Q10 configuradas.
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Contacta al administrador para que te las asigne.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Cursos con acceso Q10 */}
      {approvedEnrollments.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ExternalLink className="h-5 w-5 text-blue-400" />
              Acceso a Cursos en Q10
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {approvedEnrollments.map((enrollment) => (
                <div key={enrollment.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{enrollment.course.title}</p>
                    <p className="text-xs text-muted-foreground">{enrollment.course.category}</p>
                  </div>
                  {enrollment.course.q10Link ? (
                    <a href={enrollment.course.q10Link} target="_blank" rel="noopener noreferrer">
                      <Button variant="gradient" size="sm" className="gap-1">
                        <ExternalLink className="h-3 w-3" /> Ir al Curso
                      </Button>
                    </a>
                  ) : (
                    <Badge variant="outline" className="text-xs">Sin enlace</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <Card key={i}>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}
