import api from "@/lib/api";

export const settingsService = {
  async getRates() {
    const { data } = await api.get("/settings/rates");
    return data as Array<{ id: string; currency: string; rate: number; updatedAt: string }>;
  },

  async updateRate(currency: string, rate: number) {
    const { data } = await api.patch("/settings/rates", { currency, rate });
    return data;
  },

  async fetchRatesFromApi() {
    const { data } = await api.post("/settings/rates/fetch");
    return data as Array<{ id: string; currency: string; rate: number; updatedAt: string }>;
  },
};
