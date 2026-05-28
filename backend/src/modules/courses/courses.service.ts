import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sortBy?: string;
  }) {
    const { page = 1, limit = 12, category, search, sortBy } = query;
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'price_asc') orderBy = { price: 'asc' };
    if (sortBy === 'price_desc') orderBy = { price: 'desc' };
    if (sortBy === 'title') orderBy = { title: 'asc' };

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({ where, skip, take: limit, orderBy }),
      this.prisma.course.count({ where }),
    ]);

    return {
      data: courses,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findBySlug(slug: string) {
    const course = await this.prisma.course.findUnique({ where: { slug } });
    if (!course) throw new NotFoundException('Curso no encontrado');
    return course;
  }

  async findById(id: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException('Curso no encontrado');
    return course;
  }

  async getCategories() {
    return this.prisma.course.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ['category'],
    });
  }

  async create(dto: CreateCourseDto) {
    return this.prisma.course.create({ data: dto });
  }

  async update(id: string, dto: UpdateCourseDto) {
    await this.findById(id);
    return this.prisma.course.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.course.delete({ where: { id } });
  }
}
