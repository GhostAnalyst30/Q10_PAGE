export type Role = "USER" | "ADMIN" | "SUPER_ADMIN";

export type PaymentStatus = "PENDING" | "APPROVED" | "REJECTED" | "REFUNDED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive?: boolean;
  createdAt: string;
  q10User?: string | null;
  q10Pass?: string | null;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDesc?: string;
  price: number;
  currency: string;
  thumbnail?: string;
  category?: string;
  instructor?: string;
  whatYouLearn?: string;
  q10Link?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  paymentStatus: PaymentStatus;
  accessGranted: boolean;
  course: Course;
  createdAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  transactionId?: string;
  gateway?: string;
  user?: { id: string; name: string; email: string };
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  recentUsers: User[];
  topCourses: { course: Course; enrollments: number }[];
}
