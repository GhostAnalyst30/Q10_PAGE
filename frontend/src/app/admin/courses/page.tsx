"use client";

import { useEffect, useState } from "react";
import { Course, PaginatedResponse } from "@/types";
import { coursesService } from "@/services/courses.service";
import { adminService } from "@/services/admin.service";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { KeyConfirmDialog } from "@/components/admin/key-confirm-dialog";
import { useCurrency, getRate, convertPrice } from "@/lib/currency-context";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, ExternalLink, DollarSign, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminCoursesPage() {
  const { user } = useAuth();
  const { format } = useCurrency();
  const [data, setData] = useState<PaginatedResponse<Course> | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [keyDialogOpen, setKeyDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(key: string) => Promise<void>>();
  const [page, setPage] = useState(1);
  const [priceUsd, setPriceUsd] = useState("");
  const [priceCop, setPriceCop] = useState("");
  const [priceEur, setPriceEur] = useState("");
  const [priceMxn, setPriceMxn] = useState("");

  const isSuperAdmin = user?.role === "SUPER_ADMIN";
  const totalPages = data?.meta?.totalPages || 1;

  function loadCourses(pageNum?: number) {
    setLoading(true);
    coursesService.getAll({ page: pageNum ?? page, limit: 20 }).then((res) => {
      setData(res);
      setLoading(false);
    });
  }

  useEffect(() => {
    loadCourses(page);
  }, [page]);

  async function handleDelete(id: string) {
    if (!isSuperAdmin) {
      toast.error("Solo el Superadmin puede eliminar cursos");
      return;
    }
    const doDelete = async (key: string) => {
      try {
        await adminService.updateCourse(id, { isActive: false }, key);
        toast.success("Curso desactivado");
        loadCourses();
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Error");
        throw err;
      }
    };
    setPendingAction(() => doDelete);
    setKeyDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const price = parseFloat(form.get("price") as string) || 0;

    const courseData = {
      title: form.get("title") as string,
      slug: form.get("slug") as string,
      description: form.get("description") as string,
      shortDesc: form.get("shortDesc") as string,
      price,
      currency: "USD",
      thumbnail: form.get("thumbnail") as string || undefined,
      category: form.get("category") as string,
      instructor: form.get("instructor") as string,
      whatYouLearn: form.get("whatYouLearn") as string,
      q10Link: form.get("q10Link") as string,
    };

    try {
      if (editingCourse) {
        const doUpdate = async (key: string) => {
          try {
            await adminService.updateCourse(editingCourse.id, courseData, key);
            toast.success("Curso actualizado");
            setShowForm(false);
            setEditingCourse(null);
            loadCourses();
          } catch (err: any) {
            toast.error(err.response?.data?.message || "Error");
            throw err;
          }
        };
        if (isSuperAdmin) {
          setPendingAction(() => doUpdate);
          setKeyDialogOpen(true);
        } else {
          await adminService.updateCourse(editingCourse.id, courseData);
          toast.success("Curso actualizado");
          setShowForm(false);
          setEditingCourse(null);
          loadCourses();
        }
      } else {
        await coursesService.create(courseData);
        toast.success("Curso creado");
        setShowForm(false);
        setEditingCourse(null);
        loadCourses();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error al guardar");
    }
  }

  function resetForm() {
    setShowForm(true);
    setEditingCourse(null);
    setPriceUsd("");
    setPriceCop("");
    setPriceEur("");
    setPriceMxn("");
  }

  function handlePriceChange(changedCurrency: string, value: string) {
    const numeric = parseFloat(value) || 0;
    const c = changedCurrency as "USD" | "COP" | "EUR" | "MXN";
    setPriceUsd(value === "" ? "" : convertPrice(numeric, c, "USD").toFixed(2));
    setPriceCop(value === "" ? "" : String(Math.round(convertPrice(numeric, c, "COP"))));
    setPriceEur(value === "" ? "" : convertPrice(numeric, c, "EUR").toFixed(2));
    setPriceMxn(value === "" ? "" : convertPrice(numeric, c, "MXN").toFixed(2));
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Gestión de Cursos</h2>
        <Button variant="gradient" size="sm" onClick={resetForm}>
          <Plus className="h-4 w-4 mr-1" /> Nuevo Curso
        </Button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {editingCourse ? "Editar Curso" : "Crear Nuevo Curso"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Título</label>
                  <input name="title" defaultValue={editingCourse?.title} required className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Slug</label>
                  <input name="slug" defaultValue={editingCourse?.slug} required className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Descripción</label>
                  <textarea name="description" defaultValue={editingCourse?.description} required rows={3} className="flex w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Descripción Corta</label>
                  <input name="shortDesc" defaultValue={editingCourse?.shortDesc} className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" />
                </div>
                <div className="space-y-3 md:col-span-2">
                  <label className="text-sm font-medium">Precio en múltiples monedas</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div>
                      <label className="text-xs text-muted-foreground">USD</label>
                      <input
                        type="number"
                        step="0.01"
                        value={priceUsd}
                        onChange={(e) => handlePriceChange("USD", e.target.value)}
                        placeholder="0.00"
                        className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">COP</label>
                      <input
                        type="number"
                        step="1"
                        value={priceCop}
                        onChange={(e) => handlePriceChange("COP", e.target.value)}
                        placeholder="0"
                        className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">EUR</label>
                      <input
                        type="number"
                        step="0.01"
                        value={priceEur}
                        onChange={(e) => handlePriceChange("EUR", e.target.value)}
                        placeholder="0.00"
                        className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">MXN</label>
                      <input
                        type="number"
                        step="0.01"
                        value={priceMxn}
                        onChange={(e) => handlePriceChange("MXN", e.target.value)}
                        placeholder="0.00"
                        className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                  <input type="hidden" name="price" value={priceUsd} />
                  <input type="hidden" name="currency" value="USD" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Categoría</label>
                  <input name="category" defaultValue={editingCourse?.category} className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Instructor</label>
                  <input name="instructor" defaultValue={editingCourse?.instructor} className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">URL de la Imagen (thumbnail)</label>
                  <input name="thumbnail" defaultValue={editingCourse?.thumbnail} placeholder="https://ejemplo.com/imagen.jpg" className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">¿Qué aprenderá?</label>
                  <input name="whatYouLearn" defaultValue={editingCourse?.whatYouLearn} className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Enlace Q10</label>
                  <input name="q10Link" defaultValue={editingCourse?.q10Link} className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" />
                  {editingCourse?.q10Link && (
                    <p className="text-xs text-muted-foreground">Link actual: {editingCourse.q10Link}</p>
                  )}
                </div>
                <div className="md:col-span-2 flex gap-2">
                  <Button type="submit" variant="gradient">{editingCourse ? "Actualizar" : "Crear"} Curso</Button>
                  <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingCourse(null); }}>Cancelar</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
        </div>
      ) : (
        <motion.div className="space-y-2" initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.03 } } }}>
          {data?.data.map((course) => (
            <motion.div
              key={course.id}
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ scale: 1.01, boxShadow: "0 0 20px rgba(0, 87, 255, 0.08)" }}
            >
              <Card>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <ExternalLink className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{course.title}</p>
                      <div className="flex gap-2 mt-1">
                        {course.category && <Badge variant="secondary" className="text-xs">{course.category}</Badge>}
                        <Badge variant="outline" className="text-xs">
                          {format(course.price)}
                        </Badge>
                        {course.q10Link && (
                          <Badge variant="success" className="text-xs flex items-center gap-1">
                            <ExternalLink className="h-3 w-3" /> Q10
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => { setEditingCourse(course); setShowForm(true); const price = course.price; setPriceUsd(price.toFixed(2)); setPriceCop(String(Math.round(price * getRate("COP")))); setPriceEur((price * getRate("EUR")).toFixed(2)); setPriceMxn((price * getRate("MXN")).toFixed(2)); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {isSuperAdmin && (
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(course.id)}>
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button variant="outline" size="sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {page} de {totalPages}
          </span>
          <Button variant="outline" size="sm" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <KeyConfirmDialog
        open={keyDialogOpen}
        onOpenChange={setKeyDialogOpen}
        onConfirm={async (key) => {
          if (pendingAction) {
            await pendingAction(key);
          }
        }}
        title="Confirmar cambio en curso"
        description="Ingresa la clave de superadmin para realizar cambios en este curso"
      />
    </motion.div>
  );
}
