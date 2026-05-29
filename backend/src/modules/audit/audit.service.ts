import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(params: {
    userId: string;
    userName: string;
    userEmail: string;
    userRole: string;
    action: string;
    entity: string;
    entityId?: string;
    details?: string;
    snapshot?: string;
  }) {
    return this.prisma.auditLog.create({ data: params });
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    userId?: string;
    entity?: string;
    action?: string;
  }) {
    const { page = 1, limit = 50, userId, entity, action } = query;
    const skip = (page - 1) * limit;
    const where: any = { undoneAt: null };
    if (userId) where.userId = userId;
    if (entity) where.entity = entity;
    if (action) where.action = action;

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id: string) {
    const log = await this.prisma.auditLog.findUnique({ where: { id } });
    if (!log) throw new NotFoundException('Entrada de auditoría no encontrada');
    return log;
  }

  async markUndone(id: string) {
    return this.prisma.auditLog.update({
      where: { id },
      data: { undoneAt: new Date() },
    });
  }
}
