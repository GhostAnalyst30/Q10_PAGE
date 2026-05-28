"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Course } from "@/types";
import { coursesService } from "@/services/courses.service";
import { paymentsService } from "@/services/payments.service";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrency } from "@/lib/currency-context";
import toast from "react-hot-toast";
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
} from "lucide-react";

export default function CourseDetailPage() {
  const { format } = useCurrency();
  const params = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [gateway, setGateway] = useState<"stripe" | "wompi">("stripe");

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
      if (gateway === "wompi") {
        const data = await paymentsService.createWompiPayment(course!.id);
        toast.success("Redirigiendo a Wompi...");
        const wompiUrl = `https://checkout.wompi.co/p/?public-key=${data.publicKey}&amount=${data.amount}&currency=COP&reference=${data.reference}&signature:integrity=${data.signature}&redirect-url=${data.redirectUrl}`;
        window.location.href = wompiUrl;
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
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/courses"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a cursos
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="h-64 sm:h-80 rounded-2xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center mb-6 overflow-hidden">
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
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
                  {format(course.price)}
                </div>

                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => setGateway("stripe")}
                    className={`flex-1 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      gateway === "stripe"
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                        : "bg-muted text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    Stripe (USD)
                  </button>
                  <button
                    onClick={() => setGateway("wompi")}
                    className={`flex-1 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      gateway === "wompi"
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                        : "bg-muted text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    Wompi (COP)
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
                  Pago seguro con {gateway === "stripe" ? "Stripe" : "Wompi"}
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
          </div>
        </div>
      </div>
    </div>
  );
}
