"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Shield, Users, BookOpen, CreditCard, BarChart3, UserPlus, UserCog, Database, Activity } from "lucide-react";

const sidebarLinks = [
  { href: "/admin", label: "Estadísticas", icon: BarChart3, adminOnly: false },
  { href: "/admin/users", label: "Usuarios", icon: Users, adminOnly: false },
  { href: "/admin/courses", label: "Cursos", icon: BookOpen, adminOnly: false },
  { href: "/admin/payments", label: "Pagos", icon: CreditCard, adminOnly: false },
  { href: "/admin/access", label: "Accesos", icon: UserPlus, adminOnly: false },
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
      <motion.div
        className="min-h-screen p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Skeleton className="h-8 w-48 mb-8" />
        <Skeleton className="h-64 w-full" />
      </motion.div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <motion.div
      className="min-h-screen"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Panel de Administración</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-1">
            <motion.nav
              className="space-y-1"
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.03 } } }}
            >
              {sidebarLinks
                .filter((link) => !link.adminOnly || isSuperAdmin)
                .map((link) => (
                <motion.div
                  key={link.href}
                  variants={{ hidden: { opacity: 0, x: -15 }, visible: { opacity: 1, x: 0 } }}
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                >
                <Link
                  href={link.href}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors hover:bg-accent"
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
                </motion.div>
              ))}
            </motion.nav>
          </div>
          <motion.div
            className="lg:col-span-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
