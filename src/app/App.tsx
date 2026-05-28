import { useState } from "react";
import { motion } from "motion/react";
import {
  BookOpen,
  Zap,
  Users,
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
  Menu,
  X,
  CreditCard,
  Lock,
  Award,
  TrendingUp,
  Brain,
  Shield,
  ChevronRight,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
type Page = "home" | "courses" | "payment";
type Category = "Todos" | "Tecnología" | "Marketing" | "IA & Datos" | "Diseño" | "Gestión";
type PayMethod = "payu" | "mercadopago" | "transfer";

interface Course {
  id: number;
  title: string;
  category: string;
  duration: string;
  price: number;
  students: number;
  rating: number;
  image: string;
  modules: number;
  instructor: string;
  description: string;
  badge?: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────
const COURSES: Course[] = [
  {
    id: 1,
    title: "Desarrollo Web con React & Next.js",
    category: "Tecnología",
    duration: "48 horas",
    price: 299000,
    students: 1243,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop&auto=format",
    modules: 12,
    instructor: "Carlos Mendoza",
    description: "Domina el desarrollo frontend moderno con React 18, Next.js 14 y TypeScript. Proyectos reales incluidos.",
    badge: "Más Popular",
  },
  {
    id: 2,
    title: "Marketing Digital Avanzado",
    category: "Marketing",
    duration: "32 horas",
    price: 199000,
    students: 876,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=400&fit=crop&auto=format",
    modules: 8,
    instructor: "Valentina Cruz",
    description: "Estrategias de crecimiento, SEO, SEM, redes sociales y analítica para resultados medibles.",
  },
  {
    id: 3,
    title: "Inteligencia Artificial para Negocios",
    category: "IA & Datos",
    duration: "40 horas",
    price: 399000,
    students: 654,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&h=400&fit=crop&auto=format",
    modules: 10,
    instructor: "Dr. Andrés Ríos",
    description: "Implementa soluciones de IA en tu empresa. ChatGPT API, automatización y análisis predictivo.",
    badge: "Nuevo",
  },
  {
    id: 4,
    title: "Diseño UX/UI Profesional",
    category: "Diseño",
    duration: "36 horas",
    price: 249000,
    students: 432,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&h=400&fit=crop&auto=format",
    modules: 9,
    instructor: "Sofía Herrera",
    description: "De wireframes a prototipos en Figma. Design systems y metodologías centradas en el usuario.",
  },
  {
    id: 5,
    title: "Gestión de Proyectos Ágiles",
    category: "Gestión",
    duration: "24 horas",
    price: 179000,
    students: 987,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop&auto=format",
    modules: 6,
    instructor: "Roberto Gómez",
    description: "Scrum, Kanban y OKRs aplicados. Lidera equipos de alto rendimiento. Certificación incluida.",
  },
  {
    id: 6,
    title: "Python para Data Science",
    category: "IA & Datos",
    duration: "52 horas",
    price: 349000,
    students: 765,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=400&fit=crop&auto=format",
    modules: 14,
    instructor: "Luisa Ramírez",
    description: "Python, Pandas, NumPy, Scikit-learn y proyectos con datos reales. De cero a Data Scientist.",
    badge: "Bestseller",
  },
];

const CATEGORIES: Category[] = ["Todos", "Tecnología", "Marketing", "IA & Datos", "Diseño", "Gestión"];

const formatCOP = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

// ─── Nav ─────────────────────────────────────────────────────────────────────
function Nav({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080808]/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
        <button onClick={() => setPage("home")} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0057ff] rounded flex items-center justify-center">
            <Zap size={15} className="text-white fill-white" />
          </div>
          <span
            className="text-white font-bold text-lg tracking-tight"
            style={{ fontFamily: "Barlow Condensed, Arial Narrow, sans-serif" }}
          >
            Acad<span className="text-[#0057ff]">IO</span>
          </span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {(["home", "courses"] as Page[]).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`text-sm font-medium transition-colors ${
                page === p ? "text-white" : "text-white/40 hover:text-white/80"
              }`}
            >
              {p === "home" ? "Inicio" : "Cursos"}
            </button>
          ))}
        </div>

        <div className="hidden md:block">
          <button
            onClick={() => setPage("courses")}
            className="bg-[#0057ff] hover:bg-[#0044cc] text-white text-sm font-semibold px-5 py-2 rounded-md transition-colors"
          >
            Explorar Cursos
          </button>
        </div>

        <button className="md:hidden text-white/60 hover:text-white" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[#0d0d0d] border-t border-white/5 px-5 py-4 flex flex-col gap-4">
          <button onClick={() => { setPage("home"); setOpen(false); }} className="text-sm text-white/60 hover:text-white text-left">Inicio</button>
          <button onClick={() => { setPage("courses"); setOpen(false); }} className="text-sm text-white/60 hover:text-white text-left">Cursos</button>
          <button onClick={() => { setPage("courses"); setOpen(false); }} className="bg-[#0057ff] text-white text-sm font-semibold px-4 py-2.5 rounded-md">Explorar Cursos</button>
        </div>
      )}
    </nav>
  );
}

// ─── CourseCard ───────────────────────────────────────────────────────────────
function CourseCard({ course, onEnroll }: { course: Course; onEnroll: (c: Course) => void }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="bg-[#111] border border-white/[0.08] rounded-xl overflow-hidden group flex flex-col h-full"
    >
      <div className="relative h-44 overflow-hidden bg-gray-900 shrink-0">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
        {course.badge && (
          <span className="absolute top-3 left-3 bg-[#0057ff] text-white text-[10px] font-mono font-medium px-2 py-0.5 rounded">
            {course.badge}
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <span className="text-[#0057ff] text-[11px] font-mono font-medium mb-2 uppercase tracking-wide">
          {course.category}
        </span>
        <h3
          className="text-white font-black text-xl leading-tight mb-2"
          style={{ fontFamily: "Barlow Condensed, Arial Narrow, sans-serif" }}
        >
          {course.title}
        </h3>
        <p className="text-white/40 text-sm leading-relaxed mb-4 flex-1">{course.description}</p>

        <div className="flex items-center gap-3 text-[11px] text-white/30 font-mono mb-3">
          <span className="flex items-center gap-1"><Clock size={10} /> {course.duration}</span>
          <span className="flex items-center gap-1"><BookOpen size={10} /> {course.modules} módulos</span>
          <span className="flex items-center gap-1"><Users size={10} /> {course.students.toLocaleString()}</span>
        </div>

        <div className="flex items-center gap-1 mb-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={11}
              className={i < Math.floor(course.rating) ? "text-[#0057ff] fill-[#0057ff]" : "text-white/15"}
            />
          ))}
          <span className="text-white/30 text-[11px] ml-1 font-mono">{course.rating}</span>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.06]">
          <div>
            <div
              className="text-white font-black text-xl"
              style={{ fontFamily: "Barlow Condensed, Arial Narrow, sans-serif" }}
            >
              {formatCOP(course.price)}
            </div>
            <div className="text-white/25 text-[10px] font-mono">Acceso de por vida</div>
          </div>
          <button
            onClick={() => onEnroll(course)}
            className="bg-[#0057ff] hover:bg-[#0044cc] text-white text-sm font-semibold px-4 py-2 rounded-md transition-colors flex items-center gap-1.5"
          >
            Inscribirse <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── HomePage ─────────────────────────────────────────────────────────────────
function HomePage({ setPage, setSelectedCourse }: { setPage: (p: Page) => void; setSelectedCourse: (c: Course) => void }) {
  return (
    <div className="min-h-screen bg-[#080808]">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#0057ff 1px, transparent 1px), linear-gradient(90deg, #0057ff 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#0057ff]/8 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#080808] to-transparent" />

        <div className="relative max-w-7xl mx-auto px-5 py-32 flex flex-col items-center text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <div className="inline-flex items-center gap-2 bg-[#0057ff]/10 border border-[#0057ff]/20 rounded-full px-4 py-1.5 mb-10">
              <span className="w-1.5 h-1.5 bg-[#0057ff] rounded-full animate-pulse" />
              <span className="text-[#0057ff] text-[11px] font-mono font-medium tracking-wide">
                Plataforma activa · +500 estudiantes certificados en Q10
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="font-black text-[clamp(3.5rem,10vw,8rem)] leading-none tracking-tight text-white mb-8"
            style={{ fontFamily: "Barlow Condensed, Arial Narrow, sans-serif" }}
          >
            APRENDE.<br />
            <span className="text-[#0057ff]">CRECE.</span><br />
            DESTACA.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.25 }}
            className="text-white/45 text-lg md:text-xl max-w-2xl leading-relaxed mb-12"
          >
            Cursos profesionales dictados por expertos de la industria, certificados y alojados en la plataforma <span className="text-white/70">Q10</span>. Transforma tu carrera hoy.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <button
              onClick={() => setPage("courses")}
              className="bg-[#0057ff] hover:bg-[#0044cc] text-white font-semibold px-8 py-4 rounded-lg transition-colors flex items-center gap-2 text-base"
            >
              Ver todos los cursos <ArrowRight size={17} />
            </button>
            <button className="border border-white/12 hover:border-white/25 text-white/70 hover:text-white font-medium px-8 py-4 rounded-lg transition-colors text-base">
              ¿Cómo funciona?
            </button>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/[0.06] bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-5 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
          {[
            { value: "500+", label: "Estudiantes activos" },
            { value: "30+", label: "Cursos disponibles" },
            { value: "95%", label: "Tasa de satisfacción" },
            { value: "Q10", label: "Plataforma certificada" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div
                className="text-4xl md:text-5xl font-black text-white"
                style={{ fontFamily: "Barlow Condensed, Arial Narrow, sans-serif" }}
              >
                {s.value}
              </div>
              <div className="text-white/35 text-xs mt-1.5 font-mono">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-5 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <span className="text-[#0057ff] font-mono text-xs font-medium tracking-widest uppercase">¿Por qué elegirnos?</span>
          <h2
            className="font-black text-4xl md:text-5xl text-white mt-3 leading-tight"
            style={{ fontFamily: "Barlow Condensed, Arial Narrow, sans-serif" }}
          >
            Educación que<br />genera resultados
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: Award, title: "Certificación Q10", desc: "Certificados reconocidos emitidos vía Q10, respaldados por empresas líderes del sector." },
            { icon: Brain, title: "Expertos reales", desc: "Instructores con 10+ años de experiencia activa en la industria, no solo académicos." },
            { icon: TrendingUp, title: "Contenido vivo", desc: "Material actualizado cada trimestre. Lo que aprendes hoy es relevante mañana." },
            { icon: Shield, title: "Acceso de por vida", desc: "Paga una vez. Accede siempre. Futuras actualizaciones del curso incluidas sin costo." },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 bg-[#111] border border-white/[0.07] rounded-xl hover:border-[#0057ff]/25 transition-colors group"
            >
              <div className="w-10 h-10 bg-[#0057ff]/10 rounded-lg flex items-center justify-center mb-5 group-hover:bg-[#0057ff]/20 transition-colors">
                <f.icon size={18} className="text-[#0057ff]" />
              </div>
              <h3 className="text-white font-semibold text-base mb-2">{f.title}</h3>
              <p className="text-white/35 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured courses */}
      <section className="border-y border-white/[0.06] bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-5 py-24">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-[#0057ff] font-mono text-xs font-medium tracking-widest uppercase">Cursos destacados</span>
              <h2
                className="font-black text-4xl text-white mt-2"
                style={{ fontFamily: "Barlow Condensed, Arial Narrow, sans-serif" }}
              >
                Los más elegidos
              </h2>
            </div>
            <button
              onClick={() => setPage("courses")}
              className="hidden md:flex items-center gap-1.5 text-[#0057ff] hover:text-white transition-colors text-sm font-medium"
            >
              Ver todos <ChevronRight size={15} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COURSES.slice(0, 3).map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
              >
                <CourseCard
                  course={course}
                  onEnroll={(c) => { setSelectedCourse(c); setPage("payment"); }}
                />
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => setPage("courses")}
              className="border border-white/10 hover:border-[#0057ff]/40 text-white/60 hover:text-[#0057ff] font-medium px-8 py-3 rounded-lg transition-colors"
            >
              Ver todos los cursos disponibles
            </button>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-5 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative bg-[#0057ff] rounded-2xl p-12 md:p-20 text-center overflow-hidden"
        >
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative">
            <h2
              className="font-black text-5xl md:text-7xl text-white mb-5 leading-tight"
              style={{ fontFamily: "Barlow Condensed, Arial Narrow, sans-serif" }}
            >
              ¿LISTO PARA<br />EMPEZAR?
            </h2>
            <p className="text-white/70 text-lg mb-10 max-w-lg mx-auto">
              Únete a más de 500 profesionales que ya transformaron su carrera con nuestros cursos.
            </p>
            <button
              onClick={() => setPage("courses")}
              className="bg-white text-[#0057ff] font-black px-8 py-4 rounded-xl text-base hover:bg-white/90 transition-colors"
              style={{ fontFamily: "Barlow Condensed, Arial Narrow, sans-serif" }}
            >
              Comenzar ahora →
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-5 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-[#0057ff] rounded flex items-center justify-center">
                  <Zap size={13} className="text-white fill-white" />
                </div>
                <span
                  className="text-white font-bold text-base"
                  style={{ fontFamily: "Barlow Condensed, Arial Narrow, sans-serif" }}
                >
                  Acad<span className="text-[#0057ff]">IO</span>
                </span>
              </div>
              <p className="text-white/25 text-sm leading-relaxed">
                Formación profesional certificada en Q10 para el mercado hispanoamericano.
              </p>
            </div>
            {[
              { title: "Cursos", links: ["Tecnología", "Marketing", "IA & Datos", "Diseño", "Gestión"] },
              { title: "Plataforma", links: ["Q10", "Certificaciones", "Instructores", "Blog"] },
              { title: "Contacto", links: ["WhatsApp: +57 300 000 0000", "info@acadio.co", "Preguntas frecuentes"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-white font-semibold text-sm mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <span className="text-white/25 hover:text-white/60 text-sm cursor-pointer transition-colors">
                        {link}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/[0.06] pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-white/20 text-xs font-mono">© 2024 AcadIO. Todos los derechos reservados.</p>
            <p className="text-white/20 text-xs font-mono">
              Cursos alojados en <span className="text-[#0057ff]/50">Q10</span> · Pagos seguros · Colombia
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── CoursesPage ──────────────────────────────────────────────────────────────
function CoursesPage({ setPage, setSelectedCourse }: { setPage: (p: Page) => void; setSelectedCourse: (c: Course) => void }) {
  const [activeCategory, setActiveCategory] = useState<Category>("Todos");
  const filtered = activeCategory === "Todos" ? COURSES : COURSES.filter((c) => c.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#080808] pt-16">
      <div className="bg-[#0d0d0d] border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#0057ff] font-mono text-xs font-medium tracking-widest uppercase">Catálogo</span>
            <h1
              className="font-black text-5xl md:text-6xl text-white mt-2 mb-3"
              style={{ fontFamily: "Barlow Condensed, Arial Narrow, sans-serif" }}
            >
              Todos los cursos
            </h1>
            <p className="text-white/35 text-lg max-w-xl">
              Aprende con expertos, certifícate en Q10 y avanza en tu carrera.
            </p>
          </motion.div>

          <div className="flex flex-wrap gap-2 mt-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-md text-sm font-mono font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-[#0057ff] text-white"
                    : "bg-[#161616] border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-14">
        <p className="text-white/25 text-sm font-mono mb-8">
          {filtered.length} curso{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <CourseCard
                course={course}
                onEnroll={(c) => { setSelectedCourse(c); setPage("payment"); }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PaymentPage ──────────────────────────────────────────────────────────────
function PaymentPage({ course, setPage }: { course: Course | null; setPage: (p: Page) => void }) {
  const target = course ?? COURSES[0];
  const [step, setStep] = useState<1 | 2>(1);
  const [method, setMethod] = useState<PayMethod>("payu");
  const [form, setForm] = useState({ name: "", email: "", phone: "", docId: "" });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#080808] pt-16 flex items-center justify-center px-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#111] border border-white/[0.08] rounded-2xl p-14 text-center max-w-lg w-full"
        >
          <div className="w-20 h-20 bg-[#0057ff]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={38} className="text-[#0057ff]" />
          </div>
          <h2
            className="font-black text-4xl text-white mb-3"
            style={{ fontFamily: "Barlow Condensed, Arial Narrow, sans-serif" }}
          >
            ¡Inscripción exitosa!
          </h2>
          <p className="text-white/45 mb-2">
            Recibirás acceso a Q10 en{" "}
            <span className="text-white">{form.email || "tu correo registrado"}</span>.
          </p>
          <p className="text-white/25 text-xs font-mono mb-10">Activación en las próximas 24 horas hábiles</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setPage("courses")}
              className="bg-[#0057ff] hover:bg-[#0044cc] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Explorar más cursos
            </button>
            <button className="border border-white/10 hover:border-white/25 text-white/60 hover:text-white font-medium px-6 py-3 rounded-lg transition-colors">
              Ir a Q10
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] pt-16">
      <div className="max-w-5xl mx-auto px-5 py-14">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <button
            onClick={() => setPage("courses")}
            className="text-white/30 hover:text-white text-sm font-mono mb-8 flex items-center gap-2 transition-colors"
          >
            ← Volver a cursos
          </button>
          <span className="text-[#0057ff] font-mono text-xs font-medium tracking-widest uppercase">Checkout</span>
          <h1
            className="font-black text-4xl md:text-5xl text-white mt-2 mb-12"
            style={{ fontFamily: "Barlow Condensed, Arial Narrow, sans-serif" }}
          >
            Completa tu inscripción
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
              {/* Step 1: Student info */}
              <div className="bg-[#111] border border-white/[0.08] rounded-xl p-6">
                <h3 className="font-semibold text-white text-base mb-5 flex items-center gap-2.5">
                  <span className="w-6 h-6 bg-[#0057ff] rounded-full flex items-center justify-center text-xs font-mono text-white">1</span>
                  Datos del estudiante
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: "name", label: "Nombre completo", placeholder: "María García López", type: "text" },
                    { key: "email", label: "Correo electrónico", placeholder: "tu@correo.com", type: "email" },
                    { key: "phone", label: "WhatsApp", placeholder: "+57 300 000 0000", type: "tel" },
                    { key: "docId", label: "Número de cédula", placeholder: "1234567890", type: "text" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="text-white/35 text-xs font-mono mb-1.5 block">{field.label}</label>
                      <input
                        required
                        type={field.type}
                        placeholder={field.placeholder}
                        value={form[field.key as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                        className="w-full bg-[#0d0d0d] border border-white/[0.08] rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:border-[#0057ff]/50 focus:outline-none transition-colors"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 2: Payment method */}
              <div className="bg-[#111] border border-white/[0.08] rounded-xl p-6">
                <h3 className="font-semibold text-white text-base mb-5 flex items-center gap-2.5">
                  <span className="w-6 h-6 bg-[#0057ff] rounded-full flex items-center justify-center text-xs font-mono text-white">2</span>
                  Método de pago
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                  {[
                    { key: "payu" as PayMethod, label: "PayU", sub: "Tarjeta / PSE / Efecty" },
                    { key: "mercadopago" as PayMethod, label: "MercadoPago", sub: "Billetera digital" },
                    { key: "transfer" as PayMethod, label: "Transferencia", sub: "Bancolombia / Nequi" },
                  ].map((m) => (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => setMethod(m.key)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        method === m.key
                          ? "border-[#0057ff] bg-[#0057ff]/5"
                          : "border-white/[0.07] hover:border-white/15"
                      }`}
                    >
                      <CreditCard
                        size={16}
                        className={method === m.key ? "text-[#0057ff]" : "text-white/25"}
                      />
                      <div className="font-medium text-white text-sm mt-2">{m.label}</div>
                      <div className="text-white/25 text-[11px] font-mono mt-0.5">{m.sub}</div>
                    </button>
                  ))}
                </div>

                {method === "transfer" && (
                  <div className="bg-[#0d0d0d] rounded-lg p-4 text-sm font-mono text-white/40 space-y-1.5">
                    <p><span className="text-white/20">Banco:</span> Bancolombia</p>
                    <p><span className="text-white/20">Cuenta Ahorros:</span> 123-456789-00</p>
                    <p><span className="text-white/20">NIT:</span> 900.123.456-7</p>
                    <p><span className="text-white/20">A nombre de:</span> AcadIO SAS</p>
                    <p className="text-[#0057ff]/50 pt-1">Envía tu comprobante a pagos@acadio.co</p>
                  </div>
                )}

                {method !== "transfer" && (
                  <div className="bg-[#0d0d0d] rounded-lg p-4 text-sm text-white/30 font-mono">
                    Al confirmar serás redirigido a la pasarela de{" "}
                    <span className="text-white/50">{method === "payu" ? "PayU" : "MercadoPago"}</span> para completar el pago de forma segura.
                  </div>
                )}

                <div className="flex items-center gap-2 mt-4">
                  <Lock size={11} className="text-white/20" />
                  <span className="text-white/20 text-[11px] font-mono">Pago 100% seguro · Cifrado SSL · Sin guardar datos de tarjeta</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0057ff] hover:bg-[#0044cc] text-white font-black text-xl py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                style={{ fontFamily: "Barlow Condensed, Arial Narrow, sans-serif" }}
              >
                Confirmar inscripción <ArrowRight size={20} />
              </button>
            </form>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#111] border border-white/[0.08] rounded-xl overflow-hidden sticky top-24">
                <div className="h-40 bg-gray-900 overflow-hidden">
                  <img src={target.image} alt={target.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <span className="text-[#0057ff] text-[10px] font-mono uppercase tracking-wide">{target.category}</span>
                  <h3 className="text-white font-semibold text-base mt-1 mb-0.5 leading-snug">{target.title}</h3>
                  <p className="text-white/30 text-xs mb-5">con {target.instructor}</p>

                  <div className="space-y-2 mb-5">
                    {[
                      `${target.modules} módulos · ${target.duration}`,
                      "Acceso de por vida",
                      "Certificado Q10 incluido",
                      "Soporte por WhatsApp",
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-2">
                        <CheckCircle size={12} className="text-[#0057ff] shrink-0 mt-0.5" />
                        <span className="text-white/40 text-xs">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-white/[0.06] pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/25 text-xs font-mono">Subtotal</span>
                      <span className="text-white/45 text-sm">{formatCOP(target.price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/25 text-xs font-mono">IVA (0%)</span>
                      <span className="text-white/45 text-sm">$0</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-2 border-t border-white/[0.06]">
                      <span className="text-white font-semibold text-sm">Total</span>
                      <span
                        className="text-[#0057ff] font-black text-xl"
                        style={{ fontFamily: "Barlow Condensed, Arial Narrow, sans-serif" }}
                      >
                        {formatCOP(target.price)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  return (
    <div className="bg-[#080808] min-h-screen">
      <Nav page={page} setPage={setPage} />
      <motion.div
        key={page}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {page === "home" && (
          <HomePage setPage={setPage} setSelectedCourse={setSelectedCourse} />
        )}
        {page === "courses" && (
          <CoursesPage setPage={setPage} setSelectedCourse={setSelectedCourse} />
        )}
        {page === "payment" && (
          <PaymentPage course={selectedCourse} setPage={setPage} />
        )}
      </motion.div>
    </div>
  );
}
