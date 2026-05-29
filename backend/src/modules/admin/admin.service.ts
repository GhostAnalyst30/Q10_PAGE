import { Injectable, ConflictException, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { AuditService } from '../audit/audit.service';
import { Role } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private emailService: EmailService,
    private auditService: AuditService,
  ) {}

  private verifySuperAdminKey(key: string) {
    const validKey = this.configService.get('SUPER_ADMIN_KEY');
    if (key !== validKey) {
      throw new ForbiddenException('Clave de seguridad incorrecta');
    }
  }

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

  async verifyKey(key: string) {
    this.verifySuperAdminKey(key);
    return { verified: true, message: 'Identidad confirmada' };
  }

  async getStats() {
    const [
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalRevenue,
      recentUsers,
      topCourses,
      totalCartItems,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.course.count({ where: { isActive: true } }),
      this.prisma.enrollment.count({ where: { paymentStatus: 'APPROVED' } }),
      this.prisma.payment.aggregate({
        where: { status: 'APPROVED' },
        _sum: { amount: true },
      }),
      this.prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      }),
      this.prisma.enrollment.groupBy({
        by: ['courseId'],
        where: { paymentStatus: 'APPROVED' },
        _count: true,
        orderBy: { _count: { courseId: 'desc' } },
        take: 5,
      }),
      this.prisma.cartItem.count(),
    ]);

    const courseIds = topCourses.map((c) => c.courseId);
    const courses = await this.prisma.course.findMany({
      where: { id: { in: courseIds } },
      select: { id: true, title: true, price: true },
    });

    const topCourseData = topCourses.map((tc) => {
      const course = courses.find((c) => c.id === tc.courseId);
      return {
        course: course || { id: tc.courseId, title: 'Unknown', price: 0 },
        enrollments: tc._count,
      };
    });

    return {
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalRevenue: totalRevenue._sum.amount || 0,
      totalCartItems,
      recentUsers,
      topCourses: topCourseData,
    };
  }

  async findUsers(page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          q10User: true,
          q10Pass: true,
          _count: { select: { enrollments: true } },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async updateUserRole(userId: string, role: Role, key?: string, caller?: any) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (user.role === Role.SUPER_ADMIN && key) {
      this.verifySuperAdminKey(key);
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });

    await this.audit(caller, 'update_role', 'user', userId, `Rol cambiado de ${user.role} a ${role} (${updated.name})`, JSON.stringify({ previousRole: user.role }));
    return updated;
  }

  async toggleUserStatus(userId: string, key?: string, caller?: any) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (user.role === Role.SUPER_ADMIN && key) {
      this.verifySuperAdminKey(key);
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
      select: { id: true, name: true, email: true, isActive: true },
    });

    const status = updated.isActive ? 'activado' : 'suspendido';
    await this.audit(caller, 'toggle_status', 'user', userId, `Usuario ${status}: ${updated.name}`, JSON.stringify({ previousStatus: user.isActive }));
    return updated;
  }

  async createUser(name: string, email: string, password: string, key: string, caller?: any) {
    this.verifySuperAdminKey(key);

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('El email ya está registrado');

    const hashedPassword = await bcrypt.hash(password, 12);
    const created = await this.prisma.user.create({
      data: { name, email, password: hashedPassword, role: Role.USER },
      select: { id: true, name: true, email: true, role: true },
    });

    await this.audit(caller, 'create_user', 'user', created.id, `Usuario creado: ${name} (${email})`, JSON.stringify({ userId: created.id }));
    return created;
  }

  async getUsersByRegistration() {
    const total = await this.prisma.user.count();
    const active = await this.prisma.user.count({ where: { isActive: true } });
    const withEnrollments = await this.prisma.user.count({
      where: { enrollments: { some: { paymentStatus: 'APPROVED' } } },
    });
    const withoutEnrollments = total - withEnrollments;
    return { total, active, withEnrollments, withoutEnrollments };
  }

  async createAdmin(name: string, email: string, password: string, role: Role = Role.ADMIN, key: string, callerUser: any) {
    this.verifySuperAdminKey(key);

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('El email ya está registrado');

    const hashedPassword = await bcrypt.hash(password, 12);
    const created = await this.prisma.user.create({
      data: { name, email, password: hashedPassword, role },
      select: { id: true, name: true, email: true, role: true },
    });

    await this.audit(callerUser, 'create_admin', 'user', created.id, `Admin creado: ${name} (${email}) rol: ${role}`, JSON.stringify({ userId: created.id }));
    return created;
  }

  async updateCourse(id: string, data: any, key?: string, caller?: any) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException('Curso no encontrado');

    if (key) {
      this.verifySuperAdminKey(key);
    }

    const updated = await this.prisma.course.update({
      where: { id },
      data,
    });

    const changed = Object.keys(data).filter(k => data[k] !== undefined && data[k] !== (course as any)[k]).join(', ');
    const previous: any = {};
    for (const k of Object.keys(data)) { previous[k] = (course as any)[k]; }
    await this.audit(caller, 'update_course', 'course', id, `Curso actualizado: ${updated.title}. Cambios: ${changed || 'varios'}`, JSON.stringify({ previous }));
    return updated;
  }

  async deleteUser(userId: string, key: string, caller?: any) {
    this.verifySuperAdminKey(key);

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    if (user.role === Role.SUPER_ADMIN) {
      throw new BadRequestException('No se puede eliminar al Superadmin');
    }

    await this.prisma.user.delete({ where: { id: userId } });
    await this.audit(caller, 'delete_user', 'user', userId, `Usuario eliminado: ${user.name} (${user.email})`, JSON.stringify({ user: { name: user.name, email: user.email } }));
    return { message: 'Usuario eliminado permanentemente' };
  }

  async sendCredentialEmail(userId: string, key: string, caller?: any) {
    this.verifySuperAdminKey(key);

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    await this.emailService.sendCredentialEmail(user.email, user.name);
    await this.audit(caller, 'send_credentials', 'user', userId, `Credenciales enviadas a: ${user.email}`);
    return { message: 'Correo de credenciales enviado' };
  }

  async sendCredentialEmailWithPassword(userId: string, password: string, key: string, caller?: any) {
    this.verifySuperAdminKey(key);

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const hashedPassword = await bcrypt.hash(password, 12);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    await this.emailService.sendCredentialEmail(user.email, user.name, password);
    await this.audit(caller, 'send_credentials_password', 'user', userId, `Credenciales con contraseña enviadas a: ${user.email}`);
    return { message: 'Correo de credenciales enviado con contraseña' };
  }

  async updateQ10Link(courseId: string, q10Link: string, key: string, caller?: any) {
    this.verifySuperAdminKey(key);

    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Curso no encontrado');

    const updated = await this.prisma.course.update({
      where: { id: courseId },
      data: { q10Link },
      select: { id: true, title: true, q10Link: true },
    });

    await this.audit(caller, 'update_q10_link', 'course', courseId, `Q10 link actualizado para: ${updated.title}`);
    return updated;
  }

  async updateQ10UserCredentials(userId: string, q10User: string, q10Pass: string, key: string, caller?: any) {
    this.verifySuperAdminKey(key);

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { q10User, q10Pass },
      select: { id: true, name: true, email: true, q10User: true, q10Pass: true },
    });

    await this.audit(caller, 'update_q10_credentials', 'user', userId, `Credenciales Q10 actualizadas para: ${updated.name}`);
    return updated;
  }

  async sendQ10CredentialsEmail(userId: string, key: string, caller?: any) {
    this.verifySuperAdminKey(key);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        enrollments: {
          where: { paymentStatus: 'APPROVED' },
          include: { course: { select: { title: true, q10Link: true } } },
        },
      },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    if (!user.q10User || !user.q10Pass) {
      throw new BadRequestException('El usuario no tiene credenciales Q10 configuradas');
    }

    const courses = user.enrollments.map(e => ({
      title: e.course.title,
      link: e.course.q10Link,
    }));

    await this.emailService.sendQ10CredentialsEmail(user.email, user.name, user.q10User, user.q10Pass, courses);
    await this.audit(caller, 'send_q10_credentials', 'user', userId, `Credenciales Q10 enviadas a: ${user.email}`);
    return { message: 'Credenciales Q10 enviadas por correo' };
  }
}
