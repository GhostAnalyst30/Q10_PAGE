"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CurrencyToggle } from "@/components/currency-toggle";
import { cartService } from "@/services/cart.service";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  Settings,
  LayoutDashboard,
  Shield,
  ShoppingCart,
} from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartData, setCartData] = useState<{ count: number; items: { course: { slug: string; title: string } }[] } | null>(null);
  const [cartHover, setCartHover] = useState(false);
  const cartTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/courses", label: "Cursos" },
    { href: "/about", label: "Sobre Nosotros" },
  ];

  const isActive = (href: string) => pathname === href;

  useEffect(() => {
    if (user) {
      cartService.getCart().then((data) => setCartData(data)).catch(() => {});
    } else {
      setCartData(null);
    }
  }, [user]);

  function handleCartMouseEnter() {
    if (cartTimeoutRef.current) clearTimeout(cartTimeoutRef.current);
    setCartHover(true);
    if (user) {
      cartService.getCart().then((data) => setCartData(data)).catch(() => {});
    }
  }

  function handleCartMouseLeave() {
    cartTimeoutRef.current = setTimeout(() => setCartHover(false), 200);
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
              Q10 Courses
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors hover:text-foreground/80 ${
                  isActive(link.href)
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <CurrencyToggle />
            {user && (
              <div
                className="relative"
                onMouseEnter={handleCartMouseEnter}
                onMouseLeave={handleCartMouseLeave}
              >
                <Link
                  href="/dashboard/cart"
                  className="relative p-2 text-muted-foreground hover:text-foreground transition-colors inline-flex items-center"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartData && cartData.count > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white px-1">
                      {cartData.count > 99 ? "99+" : cartData.count}
                    </span>
                  )}
                </Link>

                <AnimatePresence>
                  {cartHover && cartData && cartData.count > 0 && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setCartHover(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 z-20 w-72 rounded-xl border border-border bg-card p-2 shadow-lg"
                      >
                        <p className="text-xs font-medium text-muted-foreground px-2 py-1">
                          Carrito ({cartData.count} curso{cartData.count !== 1 ? "s" : ""})
                        </p>
                        <Separator className="my-1" />
                        <div className="max-h-60 overflow-y-auto">
                          {cartData.items.map((item: any) => (
                            <Link
                              key={item.id}
                              href={`/courses/${item.course.slug}`}
                              onClick={() => setCartHover(false)}
                              className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-accent transition-colors"
                            >
                              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold shrink-0">
                                {item.course.title.charAt(0)}
                              </div>
                              <span className="truncate">{item.course.title}</span>
                            </Link>
                          ))}
                        </div>
                        <Separator className="my-1" />
                        <Link
                          href="/dashboard/cart"
                          onClick={() => setCartHover(false)}
                          className="flex items-center justify-center rounded-lg px-2 py-2 text-xs font-medium text-primary hover:bg-accent transition-colors"
                        >
                          Ir al carrito
                        </Link>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm hover:bg-accent transition-colors"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">{user.name}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>

                <AnimatePresence>
                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -5 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 z-20 w-56 rounded-xl border border-border bg-card p-1 shadow-lg"
                    >
                      <Link
                        href="/dashboard/my-courses"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent transition-colors"
                      >
                        <User className="h-4 w-4" />
                        Perfil
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                        Configuración
                      </Link>

                      {isAdmin && (
                        <>
                          <Separator className="my-1" />
                          <Link
                            href="/admin"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-primary hover:bg-accent transition-colors"
                          >
                            <Shield className="h-4 w-4" />
                            Admin Panel
                          </Link>
                        </>
                      )}

                      <Separator className="my-1" />
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Cerrar Sesión
                      </button>
                    </motion.div>
                  </>
                )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="gradient" size="sm">
                    Registrarse
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden border-t border-border/40 bg-background overflow-hidden"
        >
          <div className="px-4 py-4">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-3 py-2 text-sm block ${
                    isActive(link.href)
                      ? "bg-accent font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="px-3 py-2">
                <CurrencyToggle />
              </div>
              <Separator className="my-2" />
              {user ? (
                <>
                  <Link
                    href="/dashboard/my-courses"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm block"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/cart"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm flex items-center gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Carrito
                    {cartData && cartData.count > 0 && (
                      <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white px-1.5">
                        {cartData.count}
                      </span>
                    )}
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm block"
                  >
                    Perfil
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg px-3 py-2 text-sm text-primary block"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      logout();
                    }}
                    className="rounded-lg px-3 py-2 text-sm text-muted-foreground text-left w-full"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full">
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)}>
                    <Button variant="gradient" size="sm" className="w-full">
                      Registrarse
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </nav>
  );
}
