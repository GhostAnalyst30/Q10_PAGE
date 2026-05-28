import api from "@/lib/api";
import { Course, PaginatedResponse } from "@/types";

export const coursesService = {
  async getAll(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sortBy?: string;
  }) {
    const { data } = await api.get<PaginatedResponse<Course>>("/courses", {
      params,
    });
    return data;
  },

  async getBySlug(slug: string) {
    const { data } = await api.get<Course>(`/courses/${slug}`);
    return data;
  },

  async getCategories() {
    const { data } = await api.get<{ category: string }[]>("/courses/categories");
    return data;
  },

  async create(courseData: Partial<Course>) {
    const { data } = await api.post<Course>("/courses", courseData);
    return data;
  },

  async update(id: string, courseData: Partial<Course>) {
    const { data } = await api.patch<Course>(`/courses/${id}`, courseData);
    return data;
  },

  async remove(id: string) {
    await api.delete(`/courses/${id}`);
  },
};
