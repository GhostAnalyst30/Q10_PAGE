import api, { setAccessToken } from "@/lib/api";
import { User } from "@/types";

export const authService = {
  async login(email: string, password: string) {
    const { data } = await api.post<{ user: User; accessToken: string }>("/auth/login", {
      email,
      password,
    });
    setAccessToken(data.accessToken);
    return data;
  },

  async register(name: string, email: string, password: string) {
    const { data } = await api.post<{ user: User; accessToken: string }>("/auth/register", {
      name,
      email,
      password,
    });
    setAccessToken(data.accessToken);
    return data;
  },

  async logout() {
    try { await api.post("/auth/logout"); } catch {}
    setAccessToken(null);
  },

  async getProfile() {
    const { data } = await api.get<User>("/auth/profile");
    return data;
  },

  async forgotPassword(email: string) {
    const { data } = await api.post("/auth/forgot-password", { email });
    return data;
  },

  async resetPassword(token: string, password: string) {
    const { data } = await api.post("/auth/reset-password", { token, password });
    return data;
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const { data } = await api.patch("/auth/change-password", { currentPassword, newPassword });
    return data;
  },

  async changeEmail(email: string, key: string) {
    const { data } = await api.patch("/auth/change-email", { email, key });
    return data;
  },
};
