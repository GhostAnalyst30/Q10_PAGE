"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Enrollment } from "@/types";
import { enrollmentsService } from "@/services/enrollments.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { BookOpen, ExternalLink, PlayCircle, Lock } from "lucide-react";

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    enrollmentsService.getMyCourses().then((data) => {
      setEnrollments(data);
      setLoading(false);
    });
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <h2 className="text-2xl font-bold mb-6">Mis Cursos</h2>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-5 space-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-10 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : enrollments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No tienes cursos</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Aún no has comprado ningún curso. Explora nuestro catálogo.
            </p>
            <Link href="/courses">
              <Button variant="gradient">Explorar Cursos</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}>
          {enrollments.map((enrollment) => (
            <motion.div key={enrollment.id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(0, 87, 255, 0.15)" }}>
            <Card className="overflow-hidden">
              <div className="h-40 bg-primary/10 flex items-center justify-center">
                {enrollment.course.thumbnail ? (
                  <img
                    src={enrollment.course.thumbnail}
                    alt={enrollment.course.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <PlayCircle className="h-10 w-10 text-muted-foreground/40" />
                )}
              </div>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant={
                      enrollment.paymentStatus === "APPROVED"
                        ? "success"
                        : "warning"
                    }
                    className="text-xs"
                  >
                    {enrollment.paymentStatus === "APPROVED"
                      ? "Activo"
                      : "Pendiente"}
                  </Badge>
                  {enrollment.course.category && (
                    <Badge variant="secondary" className="text-xs">
                      {enrollment.course.category}
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold mb-2">
                  {enrollment.course.title}
                </h3>

                {enrollment.accessGranted && enrollment.course.q10Link ? (
                  <a
                    href={enrollment.course.q10Link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="gradient" size="sm" className="gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Ir al Curso en Q10
                    </Button>
                  </a>
                ) : enrollment.paymentStatus === "APPROVED" ? (
                  <p className="text-xs text-muted-foreground">
                    Acceso siendo preparado...
                  </p>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    Pago pendiente
                  </div>
                )}
              </CardContent>
            </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
