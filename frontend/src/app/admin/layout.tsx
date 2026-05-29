"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, Users, BookOpen, CreditCard, BarChart3, UserPlus, UserCog, Database, Activity, History, Settings } from "lucide-react";

const sidebarLinks = [
  { href: "/admin", label: "Estadísticas", icon: BarChart3, adminOnly: false },
  { href: "/admin/users", label: "Usuarios", icon: Users, adminOnly: false },
  { href: "/admin/courses", label: "Cursos", icon: BookOpen, adminOnly: false },
  { href: "/admin/payments", label: "Pagos", icon: CreditCard, adminOnly: false },
  { href: "/admin/audit", label: "Historial", icon: History, adminOnly: false },
  { href: "/admin/settings", label: "Configuración", icon: Settings, adminOnly: false },
  { href: "/admin/access", label: "Accesos", icon: UserPlus, adminOnly: true },
  { href: "/admin/create-user", label: "Crear Usuario", icon: UserCog, adminOnly: true },
  { href: "/admin/realtime", label: "Tiempo Real", icon: Activity, adminOnly: true },
  { href: "/admin/database", label: "Base de Datos", icon: Database, adminOnly: true },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/");
    }
  }, [user, loading, isAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <Skeleton className="h-8 w-48 mb-8" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Panel de Administración</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {sidebarLinks
                .filter((link) => !link.adminOnly || isSuperAdmin)
                .map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors hover:bg-accent"
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="lg:col-span-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
