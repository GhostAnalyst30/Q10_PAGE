import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    await this.emailService.sendWelcomeEmail(user.email, user.name);

    return {
      user,
      ...(await this.generateTokens(user.id, user.email)),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Cuenta suspendida');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      ...(await this.generateTokens(user.id, user.email)),
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      return this.generateTokens(user.id, user.email);
    } catch {
      throw new UnauthorizedException('Refresh token inválido');
    }
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      return { message: 'Si el email existe, recibirás instrucciones' };
    }

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 3600000);

    await this.prisma.passwordReset.create({
      data: {
        email,
        token,
        expiresAt,
      },
    });

    await this.emailService.sendPasswordResetEmail(email, token);

    return { message: 'Si el email existe, recibirás instrucciones' };
  }

  async resetPassword(token: string, newPassword: string) {
    const reset = await this.prisma.passwordReset.findUnique({
      where: { token },
    });

    if (!reset || reset.used || reset.expiresAt < new Date()) {
      throw new BadRequestException('Token inválido o expirado');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await this.prisma.user.update({
      where: { email: reset.email },
      data: { password: hashedPassword },
    });

    await this.prisma.passwordReset.update({
      where: { id: reset.id },
      data: { used: true },
    });

    return { message: 'Contraseña actualizada exitosamente' };
  }

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isMatch) throw new BadRequestException('Contraseña actual incorrecta');

    const hashedPassword = await bcrypt.hash(dto.newPassword, 12);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Contraseña actualizada exitosamente' };
  }

  async changeEmail(userId: string, newEmail: string, key: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (user.role === 'SUPER_ADMIN') {
      const validKey = process.env.SUPER_ADMIN_KEY;
      if (key !== validKey) throw new ForbiddenException('Clave de seguridad incorrecta');
    }

    const existing = await this.prisma.user.findUnique({ where: { email: newEmail } });
    if (existing && existing.id !== userId) {
      throw new ConflictException('El email ya está en uso');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { email: newEmail },
      select: { id: true, name: true, email: true, role: true },
    });
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: (process.env.JWT_EXPIRATION || '15m') as any,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: (process.env.JWT_REFRESH_EXPIRATION || '7d') as any,
    });

    return { accessToken, refreshToken };
  }
}
