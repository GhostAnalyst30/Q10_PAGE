import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('verify-key')
  @Roles(Role.SUPER_ADMIN)
  verifyKey(@Body('key') key: string) {
    return this.adminService.verifyKey(key);
  }

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  @Get('users')
  getUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.adminService.findUsers(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      search,
    );
  }

  @Patch('users/:id/role')
  updateUserRole(
    @Param('id') id: string,
    @Body('role') role: Role,
    @Body('key') key?: string,
  ) {
    return this.adminService.updateUserRole(id, role, key);
  }

  @Patch('users/:id/toggle-status')
  toggleUserStatus(
    @Param('id') id: string,
    @Body('key') key?: string,
  ) {
    return this.adminService.toggleUserStatus(id, key);
  }

  @Delete('users/:id')
  @Roles(Role.SUPER_ADMIN)
  deleteUser(
    @Param('id') id: string,
    @Body('key') key: string,
  ) {
    return this.adminService.deleteUser(id, key);
  }

  @Get('users/comparison')
  getUsersComparison() {
    return this.adminService.getUsersByRegistration();
  }

  @Post('create-admin')
  @Roles(Role.SUPER_ADMIN)
  createAdmin(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('role') role: Role,
    @Body('key') key: string,
  ) {
    return this.adminService.createAdmin(name, email, password, role, key);
  }

  @Post('create-user')
  @Roles(Role.SUPER_ADMIN)
  createUser(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('key') key: string,
  ) {
    return this.adminService.createUser(name, email, password, key);
  }

  @Post('send-credentials/:userId')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  sendCredentials(
    @Param('userId') userId: string,
    @Body('key') key: string,
  ) {
    return this.adminService.sendCredentialEmail(userId, key);
  }

  @Patch('courses/:id')
  updateCourse(
    @Param('id') id: string,
    @Body() data: any,
    @Body('key') key?: string,
  ) {
    const { key: _, ...courseData } = data;
    return this.adminService.updateCourse(id, courseData, key);
  }

  @Patch('courses/:id/q10-link')
  @Roles(Role.SUPER_ADMIN)
  updateQ10Link(
    @Param('id') id: string,
    @Body('q10Link') q10Link: string,
    @Body('key') key: string,
  ) {
    return this.adminService.updateQ10Link(id, q10Link, key);
  }

  @Patch('users/:id/q10-credentials')
  @Roles(Role.SUPER_ADMIN)
  updateQ10UserCredentials(
    @Param('id') id: string,
    @Body('q10User') q10User: string,
    @Body('q10Pass') q10Pass: string,
    @Body('key') key: string,
  ) {
    return this.adminService.updateQ10UserCredentials(id, q10User, q10Pass, key);
  }

  @Post('send-q10-credentials/:userId')
  @Roles(Role.SUPER_ADMIN)
  sendQ10Credentials(
    @Param('userId') userId: string,
    @Body('key') key: string,
  ) {
    return this.adminService.sendQ10CredentialsEmail(userId, key);
  }

  @Post('send-credentials-password/:userId')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  sendCredentialsWithPassword(
    @Param('userId') userId: string,
    @Body('password') password: string,
    @Body('key') key: string,
  ) {
    return this.adminService.sendCredentialEmailWithPassword(userId, password, key);
  }
}
