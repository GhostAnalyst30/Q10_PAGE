import api from "@/lib/api";

export const cartService = {
  async getCart() {
    const { data } = await api.get("/cart");
    return data;
  },

  async addToCart(courseId: string) {
    const { data } = await api.post("/cart/add", { courseId });
    return data;
  },

  async removeFromCart(courseId: string) {
    const { data } = await api.delete(`/cart/${courseId}`);
    return data;
  },

  async clearCart() {
    const { data } = await api.delete("/cart");
    return data;
  },
};
