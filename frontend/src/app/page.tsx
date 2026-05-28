"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Course } from "@/types";
import { coursesService } from "@/services/courses.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";
import {
  BookOpen,
  GraduationCap,
  Shield,
  Zap,
  ArrowRight,
  Star,
  Users,
  PlayCircle,
  ChevronRight,
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const stagger = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { staggerChildren: 0.1, delayChildren: 0.2 },
};

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    coursesService.getAll({ limit: 3 }).then((res) => {
      setCourses(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/10 via-transparent to-transparent" />
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Badge variant="secondary" className="mb-4">
                Plataforma de Cursos Online
              </Badge>
            </motion.div>
            <motion.h1
              className="text-4xl font-bold tracking-tight sm:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Aprende las habilidades
              <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                del futuro
              </span>
            </motion.h1>
            <motion.p
              className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Accede a cursos de alta calidad en programación, marketing, diseño y más.
              Aprende a tu ritmo con instructores expertos.
            </motion.p>
            <motion.div
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <Link href="/courses">
                <Button variant="gradient" size="lg">
                  Explorar Cursos
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="lg">
                  Comienza Gratis
                </Button>
              </Link>
            </motion.div>
            <motion.div
              className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>+1000 estudiantes</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>+20 cursos</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span>4.8 calificación</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Courses */}
      <motion.section className="py-20" {...fadeInUp}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex items-end justify-between mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h2 className="text-3xl font-bold">Cursos Destacados</h2>
              <p className="mt-2 text-muted-foreground">
                Los cursos más populares de nuestra plataforma
              </p>
            </div>
            <Link
              href="/courses"
              className="hidden sm:flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              Ver todos <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={stagger}
          >
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full rounded-none" />
                    <CardContent className="p-5 space-y-3">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-8 w-24" />
                    </CardContent>
                  </Card>
                ))
              : courses.map((course, i) => (
                  <motion.div key={course.id} variants={stagger}>
                    <Link href={`/courses/${course.slug}`}>
                      <Card className="group overflow-hidden transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/5 h-full hover:-translate-y-1">
                        <div className="h-48 bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
                          {course.thumbnail ? (
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <PlayCircle className="h-12 w-12 text-muted-foreground/40 group-hover:text-purple-400 transition-colors" />
                          )}
                        </div>
                        <CardContent className="p-5">
                          <div className="flex items-center gap-2 mb-2">
                            {course.category && (
                              <Badge variant="secondary" className="text-xs">
                                {course.category}
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-semibold text-lg mb-1 group-hover:text-purple-400 transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {course.shortDesc || course.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                              {formatPrice(course.price)}
                            </span>
                            {course.instructor && (
                              <span className="text-xs text-muted-foreground">
                                por {course.instructor}
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
          </motion.div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/courses">
              <Button variant="outline">
                Ver todos los cursos <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Benefits */}
      <motion.section className="py-20 bg-muted/50 border-y border-border/40" {...fadeInUp}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold">¿Por qué elegirnos?</h2>
            <p className="mt-2 text-muted-foreground">
              Todo lo que necesitas para impulsar tu carrera
            </p>
          </motion.div>
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" variants={stagger}>
            {[
              {
                icon: GraduationCap,
                title: "Instructores Expertos",
                description:
                  "Aprende de profesionales con años de experiencia en la industria.",
              },
              {
                icon: Zap,
                title: "Aprendizaje Flexible",
                description:
                  "Accede a los cursos 24/7 y avanza a tu propio ritmo.",
              },
              {
                icon: Shield,
                title: "Certificación",
                description:
                  "Obtén certificados al completar cada curso y valida tus conocimientos.",
              },
            ].map((benefit) => (
              <motion.div key={benefit.title} variants={stagger}>
                <Card className="text-center p-8 hover:border-purple-500/30 transition-all duration-300">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 mb-4">
                    <benefit.icon className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section className="py-20" {...fadeInUp}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold">Lo que dicen nuestros estudiantes</h2>
            <p className="mt-2 text-muted-foreground">
              Miles de estudiantes ya confían en nosotros
            </p>
          </motion.div>
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" variants={stagger}>
            {[
              {
                name: "María García",
                role: "Desarrolladora Web",
                content:
                  "Los cursos son increíblemente completos. Aprendí React desde cero y ahora trabajo como desarrolladora.",
              },
              {
                name: "Carlos López",
                role: "Emprendedor",
                content:
                  "El curso de marketing digital transformó mi negocio. Las estrategias son prácticas y aplicables.",
              },
              {
                name: "Ana Martínez",
                role: "Diseñadora UX",
                content:
                  "La plataforma es muy intuitiva y los instructores explican de manera clara y concisa.",
              },
            ].map((testimonial) => (
              <motion.div key={testimonial.name} variants={stagger}>
                <Card className="p-6 h-full hover:border-purple-500/30 transition-all duration-300">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-500 text-yellow-500"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-sm font-bold text-white">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        className="py-20 bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10 border-t border-border/40"
        {...fadeInUp}
      >
        <motion.div
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4">
            Comienza a aprender hoy
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Únete a nuestra comunidad y accede a cursos de alta calidad diseñados para impulsar tu carrera.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/register">
              <Button variant="gradient" size="lg">
                Crear Cuenta Gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>
    </div>
  );
}
