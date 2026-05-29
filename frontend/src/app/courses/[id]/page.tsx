"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Course } from "@/types";
import { coursesService } from "@/services/courses.service";
import { cartService } from "@/services/cart.service";
import { paymentsService } from "@/services/payments.service";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrency } from "@/lib/currency-context";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  PlayCircle,
  CheckCircle,
  Star,
  Users,
  Clock,
  ArrowLeft,
  Loader2,
  ExternalLink,
  CreditCard,
  ShoppingCart,
  ShoppingBag,
} from "lucide-react";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function CourseDetailPage() {
  const { format } = useCurrency();
  const params = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [gateway, setGateway] = useState<"stripe" | "pse">("stripe");

  useEffect(() => {
    coursesService.getBySlug(params.id as string).then((data) => {
      setCourse(data);
      setLoading(false);
    });
  }, [params.id]);

  async function handlePurchase() {
    if (!user) {
      toast.error("Debes iniciar sesión para comprar");
      return;
    }

    setPurchasing(true);
    try {
      if (gateway === "pse") {
        const data = await paymentsService.createPsePayment(course!.id);
        toast.success("Redirigiendo a PSE...");
        const pseUrl = `https://checkout.wompi.co/p/?public-key=${data.publicKey}&amount=${data.amount}&currency=COP&reference=${data.reference}&signature:integrity=${data.signature}&redirect-url=${data.redirectUrl}&payment-method=PSE`;
        window.location.href = pseUrl;
      } else {
        const { url } = await paymentsService.createStripePayment(course!.id);
        window.location.href = url;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error al procesar el pago");
    } finally {
      setPurchasing(false);
    }
  }

  async function handleAddToCart() {
    if (!user) {
      toast.error("Debes iniciar sesión para agregar al carrito");
      return;
    }
    setAddingToCart(true);
    try {
      await cartService.addToCart(course!.id);
      toast.success("Curso agregado al carrito");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error al agregar al carrito");
    } finally {
      setAddingToCart(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-64 w-full rounded-2xl" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div>
              <Skeleton className="h-48 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Curso no encontrado</p>
      </div>
    );
  }

  const whatYouLearnList = course.whatYouLearn?.split(",").map((s) => s.trim()) || [];

  return (
    <motion.div className="min-h-screen py-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/courses"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a cursos
        </Link>

        <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-8" variants={containerVariants} initial="hidden" animate="visible">
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            <div className="h-64 sm:h-80 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 overflow-hidden">
              {course.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
              ) : (
                <PlayCircle className="h-20 w-20 text-muted-foreground/30" />
              )}
            </div>

            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
              {course.category && <Badge variant="secondary">{course.category}</Badge>}
              {course.instructor && (
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  por {course.instructor}
                </span>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed mb-8">
              {course.description}
            </p>

            {whatYouLearnList.length > 0 && (
              <>
                <Separator className="mb-6" />
                <h2 className="text-xl font-semibold mb-4">¿Qué aprenderás?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {whatYouLearnList.map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>

          <motion.div className="lg:col-span-1" variants={itemVariants}>
            <div className="sticky top-24">
              <div className="rounded-2xl border border-border bg-card p-6">
                <motion.div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent mb-6" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}>
                  {format(course.price)}
                </motion.div>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full mb-3 gap-2"
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                >
                  {addingToCart ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ShoppingCart className="h-4 w-4" />
                  )}
                  Agregar al Carrito
                </Button>

                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => setGateway("stripe")}
                    className={`flex-1 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      gateway === "stripe"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "border border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    Stripe (USD)
                  </button>
                  <button
                    onClick={() => setGateway("pse")}
                    className={`flex-1 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      gateway === "pse"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "border border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    PSE (COP)
                  </button>
                </div>

                <Button
                  variant="gradient"
                  size="lg"
                  className="w-full mb-3"
                  onClick={handlePurchase}
                  disabled={purchasing}
                >
                  {purchasing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>Comprar Ahora <CreditCard className="ml-2 h-4 w-4" /></>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Pago seguro con {gateway === "stripe" ? "Stripe" : "PSE"}
                </p>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Acceso de por vida
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Certificado al completar
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <PlayCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Contenido 100% online
                    </span>
                  </div>
                </div>

                {course.q10Link && (
                  <div className="mt-6 p-3 rounded-xl bg-muted/50">
                    <p className="text-xs text-muted-foreground">
                      Este curso se imparte a través de Q10. Al comprar obtendrás acceso
                      a la plataforma Q10.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
