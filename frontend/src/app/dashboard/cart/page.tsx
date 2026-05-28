"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cartService } from "@/services/cart.service";
import { paymentsService } from "@/services/payments.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrency } from "@/lib/currency-context";
import toast from "react-hot-toast";
import { ShoppingCart, Trash2, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function CartPage() {
  const { format } = useCurrency();
  const { user } = useAuth();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [gateway, setGateway] = useState<"stripe" | "wompi">("stripe");

  function loadCart() {
    setLoading(true);
    cartService.getCart().then((data) => {
      setCart(data);
      setLoading(false);
    });
  }

  useEffect(() => {
    loadCart();
  }, []);

  async function handleRemove(courseId: string) {
    try {
      await cartService.removeFromCart(courseId);
      toast.success("Curso eliminado del carrito");
      loadCart();
    } catch {
      toast.error("Error al eliminar");
    }
  }

  async function handleCheckout() {
    if (!user) {
      toast.error("Debes iniciar sesión para comprar");
      return;
    }
    if (!cart?.items?.length) return;
    setPurchasing(true);
    try {
      if (gateway === "wompi") {
        const data = await paymentsService.createWompiPayment(cart.items[0].course.id);
        toast.success("Redirigiendo a Wompi...");
        const wompiUrl = `https://checkout.wompi.co/p/?public-key=${data.publicKey}&amount=${data.amount}&currency=COP&reference=${data.reference}&signature:integrity=${data.signature}&redirect-url=${data.redirectUrl}`;
        window.location.href = wompiUrl;
      } else {
        const { url } = await paymentsService.createStripePayment(cart.items[0].course.id);
        window.location.href = url;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error al procesar el pago");
    } finally {
      setPurchasing(false);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Carrito de Compras</h2>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : !cart || cart.items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Carrito vacío</h3>
            <p className="text-sm text-muted-foreground mb-6">
              No tienes cursos en tu carrito. Explora nuestro catálogo.
            </p>
            <Link href="/courses">
              <Button variant="gradient">Explorar Cursos</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            {cart.items.map((item: any) => (
              <Card key={item.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 text-sm font-bold">
                      {item.course.title.charAt(0)}
                    </div>
                    <div>
                      <Link
                        href={`/courses/${item.course.slug}`}
                        className="font-medium hover:text-purple-400 transition-colors"
                      >
                        {item.course.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {item.course.instructor && `por ${item.course.instructor}`}
                        {item.course.category && ` · ${item.course.category}`}
                      </p>
                      <p className="text-sm font-bold text-purple-400 mt-1">
                        {format(item.course.price)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(item.course.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium">Total ({cart.count} cursos)</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {format(cart.total)}
                </span>
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
                className="w-full"
                onClick={handleCheckout}
                disabled={purchasing}
              >
                {purchasing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Ir a Pagar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
