"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  CreditCard,
  User,
  Settings,
  LogOut,
  ShoppingCart,
  Key,
} from "lucide-react";

const sidebarLinks = [
  { href: "/dashboard/my-courses", label: "Mis Cursos", icon: BookOpen },
  { href: "/dashboard/cart", label: "Carrito", icon: ShoppingCart },
  { href: "/dashboard/purchases", label: "Compras", icon: CreditCard },
  { href: "/dashboard/credentials", label: "Credenciales", icon: Key },
  { href: "/dashboard/profile", label: "Perfil", icon: User },
  { href: "/dashboard/settings", label: "Configuración", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <motion.div
        className="min-h-screen p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
          <div className="lg:col-span-3">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </motion.div>
    );
  }

  if (!user) return null;

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
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <motion.nav
              className="space-y-1"
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
            >
              {sidebarLinks.map((link) => (
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
              <motion.div
                variants={{ hidden: { opacity: 0, x: -15 }, visible: { opacity: 1, x: 0 } }}
                whileHover={{ x: 3 }}
                transition={{ duration: 0.2 }}
              >
              <button
                onClick={logout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-accent"
              >
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </button>
              </motion.div>
            </motion.nav>
          </div>

          <motion.div
            className="lg:col-span-3"
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
