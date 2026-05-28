import api from "@/lib/api";
import { Enrollment } from "@/types";

export const enrollmentsService = {
  async getMyCourses() {
    const { data } = await api.get<Enrollment[]>("/enrollments/my-courses");
    return data;
  },

  async getEnrollment(courseId: string) {
    const { data } = await api.get<Enrollment>(`/enrollments/${courseId}`);
    return data;
  },
};
