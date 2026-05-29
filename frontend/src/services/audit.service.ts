import api from "@/lib/api";

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  action: string;
  entity: string;
  entityId: string | null;
  details: string | null;
  createdAt: string;
}

export const auditService = {
  async getAll(params?: { page?: number; limit?: number; entity?: string; action?: string }) {
    const { data } = await api.get<{
      data: AuditLogEntry[];
      meta: { total: number; page: number; limit: number; totalPages: number };
    }>("/audit", { params });
    return data;
  },
};
