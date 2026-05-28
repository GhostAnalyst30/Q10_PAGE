import api from "@/lib/api";
import { AdminStats, PaginatedResponse, User, Payment, Enrollment } from "@/types";

export const adminService = {
  async getStats() {
    const { data } = await api.get<AdminStats>("/admin/stats");
    return data;
  },

  async getUsers(params?: { page?: number; limit?: number; search?: string }) {
    const { data } = await api.get<PaginatedResponse<User>>("/admin/users", {
      params,
    });
    return data;
  },

  async updateUserRole(userId: string, role: string, key?: string) {
    const { data } = await api.patch(`/admin/users/${userId}/role`, { role, key });
    return data;
  },

  async toggleUserStatus(userId: string, key?: string) {
    const { data } = await api.patch(`/admin/users/${userId}/toggle-status`, { key });
    return data;
  },

  async deleteUser(userId: string, key: string) {
    const { data } = await api.delete(`/admin/users/${userId}`, { data: { key } });
    return data;
  },

  async createAdmin(name: string, email: string, password: string, role: string, key: string) {
    const { data } = await api.post("/admin/create-admin", {
      name,
      email,
      password,
      role,
      key,
    });
    return data;
  },

  async createUser(name: string, email: string, password: string, key: string) {
    const { data } = await api.post("/admin/create-user", { name, email, password, key });
    return data;
  },

  async getUsersComparison() {
    const { data } = await api.get("/admin/users/comparison");
    return data;
  },

  async getPayments(params?: { page?: number; limit?: number; status?: string }) {
    const { data } = await api.get<PaginatedResponse<Payment>>("/payments", {
      params,
    });
    return data;
  },

  async updateCourse(id: string, courseData: any, key?: string) {
    const { data } = await api.patch(`/admin/courses/${id}`, { ...courseData, key });
    return data;
  },

  async updateQ10Link(courseId: string, q10Link: string, key: string) {
    const { data } = await api.patch(`/admin/courses/${courseId}/q10-link`, { q10Link, key });
    return data;
  },

  async sendCredentials(userId: string, key: string) {
    const { data } = await api.post(`/admin/send-credentials/${userId}`, { key });
    return data;
  },

  async verifyKey(key: string) {
    const { data } = await api.post("/admin/verify-key", { key });
    return data;
  },
};
