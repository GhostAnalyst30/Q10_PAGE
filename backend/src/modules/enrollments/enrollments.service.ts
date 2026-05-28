import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  async getUserEnrollments(userId: string) {
    return this.prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            thumbnail: true,
            instructor: true,
            q10Link: true,
            category: true,
            price: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getEnrollment(userId: string, courseId: string) {
    return this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            thumbnail: true,
            q10Link: true,
          },
        },
      },
    });
  }

  async getCourseEnrollments(courseId: string) {
    return this.prisma.enrollment.findMany({
      where: { courseId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll(query: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.enrollment.findMany({
        skip,
        take: limit,
        include: {
          user: { select: { id: true, name: true, email: true } },
          course: { select: { id: true, title: true, slug: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.enrollment.count(),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }
}
