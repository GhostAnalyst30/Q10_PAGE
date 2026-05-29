import { Controller, Get, Post, Param, Query, UseGuards, Body, ForbiddenException, BadRequestException } from '@nestjs/common';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('audit')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditController {
  constructor(
    private auditService: AuditService,
    private prisma: PrismaService,
  ) {}

  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('entity') entity?: string,
    @Query('action') action?: string,
    @CurrentUser() user?: any,
  ) {
    const userId = user.role === 'SUPER_ADMIN' ? undefined : user.id;
    return this.auditService.findAll({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 50,
      userId,
      entity,
      action,
    });
  }

  @Post(':id/undo')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async undo(@Param('id') id: string, @CurrentUser() caller: any) {
    const log = await this.auditService.findById(id);

    if (log.undoneAt) {
      throw new BadRequestException('Esta acción ya fue deshecha');
    }

    if (caller.role !== 'SUPER_ADMIN' && log.userId !== caller.id) {
      throw new ForbiddenException('Solo puedes deshacer tus propias acciones');
    }

    if (!log.snapshot) {
      throw new BadRequestException('Esta acción no se puede deshacer');
    }

    const snapshot = JSON.parse(log.snapshot);

    switch (log.action) {
      case 'create_course': {
        await this.prisma.course.delete({ where: { id: log.entityId! } }).catch(() => {});
        break;
      }
      case 'delete_course': {
        if (snapshot.course) {
          await this.prisma.course.create({ data: snapshot.course }).catch(() => {});
        }
        break;
      }
      case 'update_course': {
        if (snapshot.previous) {
          await this.prisma.course.update({ where: { id: log.entityId! }, data: snapshot.previous }).catch(() => {});
        }
        break;
      }
      case 'create_user':
      case 'create_admin': {
        await this.prisma.user.update({ where: { id: log.entityId! }, data: { isActive: false } }).catch(() => {});
        break;
      }
      case 'update_role': {
        if (snapshot.previousRole) {
          await this.prisma.user.update({ where: { id: log.entityId! }, data: { role: snapshot.previousRole } }).catch(() => {});
        }
        break;
      }
      case 'toggle_status': {
        if (snapshot.previousStatus !== undefined) {
          await this.prisma.user.update({ where: { id: log.entityId! }, data: { isActive: snapshot.previousStatus } }).catch(() => {});
        }
        break;
      }
      default: {
        throw new BadRequestException(`No se puede deshacer la acción: ${log.action}`);
      }
    }

    await this.auditService.markUndone(id);
    return { message: 'Acción deshecha exitosamente' };
  }
}
