import api from "@/lib/api";
import { Payment } from "@/types";

export const paymentsService = {
  async createStripePayment(courseId: string) {
    const { data } = await api.post<{ url: string; sessionId: string }>(
      "/payments/create-stripe",
      { courseId, gateway: "stripe" }
    );
    return data;
  },

  async createWompiPayment(courseId: string) {
    const { data } = await api.post<{
      amount: number;
      currency: string;
      reference: string;
      signature: string;
      publicKey: string;
      redirectUrl: string;
      courseTitle: string;
    }>("/payments/create-wompi", { courseId });
    return data;
  },

  async getMyPayments() {
    const { data } = await api.get<Payment[]>("/payments/my-payments");
    return data;
  },
};
