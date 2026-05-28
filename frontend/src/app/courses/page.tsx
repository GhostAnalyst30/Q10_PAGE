"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Course } from "@/types";
import { coursesService } from "@/services/courses.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrency } from "@/lib/currency-context";
import { motion } from "framer-motion";
import { Search, PlayCircle, X } from "lucide-react";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const CATEGORIES = [
  "Todos",
  "Programación",
  "Marketing",
  "Diseño",
  "Finanzas",
  "Tecnología",
];

function CoursesContent() {
  const { format } = useCurrency();
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    setLoading(true);
    coursesService
      .getAll({ page, limit: 12, category: category || undefined, search: search || undefined, sortBy: sortBy || undefined })
      .then((res) => {
        setCourses(res.data);
        setTotal(res.meta.total);
        setLoading(false);
      });
  }, [page, category, search, sortBy]);

  const totalPages = Math.ceil(total / 12);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Catálogo de Cursos</h1>
        <p className="text-muted-foreground mt-1">
          Explora nuestra oferta educativa
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cursos..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10"
          />
          {search && (
            <button
              onClick={() => { setSearch(""); setPage(1); }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="h-10 rounded-xl border border-border bg-background px-3 text-sm"
        >
          <option value="">Más recientes</option>
          <option value="price_asc">Menor precio</option>
          <option value="price_desc">Mayor precio</option>
          <option value="title">A-Z</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <motion.button
            key={cat}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setCategory(cat === "Todos" ? "" : cat);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              (cat === "Todos" && !category) || cat === category
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" variants={containerVariants} initial="hidden" animate="visible">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
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
          : courses.map((course) => (
              <motion.div key={course.id} variants={itemVariants}>
              <Link href={`/courses/${course.slug}`}>
                <Card className="group overflow-hidden transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5 h-full">
                  <div className="h-48 bg-primary/10 flex items-center justify-center">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
                    ) : (
                      <PlayCircle className="h-12 w-12 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                    )}
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      {course.category && (
                        <Badge variant="secondary" className="text-xs">{course.category}</Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {course.shortDesc || course.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
                        {format(course.price)}
                      </span>
                      {course.instructor && (
                        <span className="text-xs text-muted-foreground">por {course.instructor}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
              </motion.div>
            ))}
      </motion.div>

      {!loading && courses.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground">No se encontraron cursos</p>
        </div>
      )}

      {totalPages > 1 && (
        <motion.div className="flex items-center justify-center gap-2 mt-8" initial="hidden" animate="visible" variants={containerVariants}>
          <motion.div variants={itemVariants}>
          <Button variant="outline" size="sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
            Anterior
          </Button>
          </motion.div>
          {Array.from({ length: totalPages }).map((_, i) => (
            <motion.div key={i} variants={itemVariants}>
            <Button key={i} variant={page === i + 1 ? "gradient" : "outline"} size="sm" onClick={() => setPage(i + 1)}>
              {i + 1}
            </Button>
            </motion.div>
          ))}
          <motion.div variants={itemVariants}>
          <Button variant="outline" size="sm" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
            Siguiente
          </Button>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

export default function CoursesPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full rounded-none" />
                <CardContent className="p-5 space-y-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-8 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        }>
          <CoursesContent />
        </Suspense>
      </div>
    </div>
  );
}
