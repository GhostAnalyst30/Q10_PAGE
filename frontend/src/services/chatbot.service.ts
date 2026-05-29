import api from "@/lib/api";

export const chatbotService = {
  async sendMessage(message: string, cartCourseIds?: string[]) {
    const { data } = await api.post("/chatbot/recommend", { message, cartCourseIds });
    return data as { reply: string; model: string };
  },
};
