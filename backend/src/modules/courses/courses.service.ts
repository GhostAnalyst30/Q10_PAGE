import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  private async audit(caller: any, action: string, entity: string, entityId?: string, details?: string, snapshot?: string) {
    if (!caller) return;
    await this.auditService.log({
      userId: caller.id,
      userName: caller.name,
      userEmail: caller.email,
      userRole: caller.role,
      action,
      entity,
      entityId,
      details,
      snapshot,
    }).catch(() => {});
  }

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

  async create(dto: CreateCourseDto, caller?: any) {
    const created = await this.prisma.course.create({ data: dto });
    await this.audit(caller, 'create_course', 'course', created.id, `Curso creado: ${created.title}`, JSON.stringify({ courseId: created.id }));
    return created;
  }

  async update(id: string, dto: UpdateCourseDto, caller?: any) {
    const course = await this.findById(id);
    const updated = await this.prisma.course.update({ where: { id }, data: dto });
    const changed = Object.keys(dto).filter(k => (dto as any)[k] !== undefined && (dto as any)[k] !== (course as any)[k]).join(', ');
    const previous: any = {};
    for (const k of Object.keys(dto)) { previous[k] = (course as any)[k]; }
    await this.audit(caller, 'update_course', 'course', id, `Curso actualizado: ${updated.title}. Cambios: ${changed || 'varios'}`, JSON.stringify({ previous }));
    return updated;
  }

  async remove(id: string, caller?: any) {
    const course = await this.findById(id);
    const courseData = await this.prisma.course.findUnique({ where: { id } });
    await this.prisma.course.delete({ where: { id } });
    await this.audit(caller, 'delete_course', 'course', id, `Curso eliminado: ${course.title}`, JSON.stringify({ course: courseData }));
    return { message: 'Curso eliminado' };
  }
}
