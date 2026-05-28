"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  GraduationCap,
  Shield,
  Target,
  Heart,
  Globe,
  Users,
  Star,
  ChevronRight,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";

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

export default function AboutPage() {
  const team = [
    {
      name: "Carlos Mendoza",
      role: "CEO & Fundador",
      bio: "Emprendedor con más de 15 años en educación digital.",
      initials: "CM",
    },
    {
      name: "Laura Jiménez",
      role: "Directora Académica",
      bio: "PhD en Educación, experta en diseño curricular online.",
      initials: "LJ",
    },
    {
      name: "Andrés Ruiz",
      role: "CTO",
      bio: "Ingeniero de software, apasionado por la tecnología educativa.",
      initials: "AR",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <motion.div className="text-center max-w-3xl mx-auto" {...fadeInUp}>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 mb-6">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Sobre
              <span className="block bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
                Q10 Courses
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Transformamos la educación online conectando estudiantes con
              conocimiento de calidad a través de una plataforma innovadora y
              accesible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8" {...stagger}>
            <motion.div variants={stagger} whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(0, 87, 255, 0.15)" }}>
            <Card className="p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mb-4">
                <Target className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Nuestra Misión</h2>
              <p className="text-muted-foreground leading-relaxed">
                Democratizar el acceso a la educación de calidad, ofreciendo
                cursos online impartidos por expertos que preparan a nuestros
                estudiantes para los desafíos del mundo real.
              </p>
            </Card>
            </motion.div>
            <motion.div variants={stagger} whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(0, 87, 255, 0.15)" }}>
            <Card className="p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mb-4">
                <Globe className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Nuestra Visión</h2>
              <p className="text-muted-foreground leading-relaxed">
                Ser la plataforma líder en educación online en Latinoamérica,
                reconocida por la calidad de sus cursos y el impacto real en la
                carrera de sus estudiantes.
              </p>
            </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-muted/50 border-y border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" {...fadeInUp}>
            <h2 className="text-3xl font-bold">Nuestros Valores</h2>
            <p className="mt-2 text-muted-foreground">
              Principios que guían cada decisión
            </p>
          </motion.div>
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" {...stagger}>
            {[
              {
                icon: GraduationCap,
                title: "Excelencia Académica",
                desc: "Seleccionamos cuidadosamente cada curso e instructor para garantizar la más alta calidad educativa.",
              },
              {
                icon: Heart,
                title: "Compromiso con el Estudiante",
                desc: "Ponemos al estudiante en el centro de todo lo que hacemos, asegurando su éxito y satisfacción.",
              },
              {
                icon: Shield,
                title: "Transparencia y Confianza",
                desc: "Operamos con integridad, claridad y honestidad en cada interacción con nuestra comunidad.",
              },
              {
                icon: Users,
                title: "Comunidad Inclusiva",
                desc: "Fomentamos un entorno diverso donde todos tienen la oportunidad de aprender y crecer.",
              },
              {
                icon: Award,
                title: "Innovación Constante",
                desc: "Evolucionamos continuamente nuestra plataforma para ofrecer la mejor experiencia de aprendizaje.",
              },
              {
                icon: Star,
                title: "Impacto Medible",
                desc: "Nos enfocamos en resultados reales que transformen la vida profesional de nuestros estudiantes.",
              },
            ].map((v) => (
              <motion.div key={v.title} variants={stagger} whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(0, 87, 255, 0.15)" }}>
              <Card className="p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                  <v.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" {...fadeInUp}>
            <h2 className="text-3xl font-bold">Nuestro Equipo</h2>
            <p className="mt-2 text-muted-foreground">
              Conoce a las personas detrás de Q10 Courses
            </p>
          </motion.div>
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" {...stagger}>
              {team.map((member) => (
              <motion.div key={member.name} variants={stagger} whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(0, 87, 255, 0.15)" }}>
              <Card className="p-6 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-2xl font-bold text-white mb-4">
                  {member.initials}
                </div>
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-sm text-primary mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 border-t border-border/40">
        <motion.div
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center"
          {...fadeInUp}
        >
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para comenzar tu viaje de aprendizaje?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Únete a miles de estudiantes que ya confían en Q10 Courses para
            impulsar su carrera profesional.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/courses">
              <Button variant="gradient" size="lg">
                Explorar Cursos <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg">
                Crear Cuenta Gratis
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
