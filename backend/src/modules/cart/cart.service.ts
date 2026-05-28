import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
    const items = await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            thumbnail: true,
            instructor: true,
            category: true,
          },
        },
      },
    });

    const total = items.reduce((sum, item) => sum + item.course.price, 0);

    return { items, total, count: items.length };
  }

  async addToCart(userId: string, courseId: string) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Curso no encontrado');

    const existing = await this.prisma.cartItem.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (existing) throw new BadRequestException('El curso ya está en el carrito');

    const enrolled = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (enrolled && enrolled.paymentStatus === 'APPROVED') {
      throw new BadRequestException('Ya tienes acceso a este curso');
    }

    return this.prisma.cartItem.create({
      data: { userId, courseId },
      include: {
        course: {
          select: { id: true, title: true, slug: true, price: true, thumbnail: true },
        },
      },
    });
  }

  async removeFromCart(userId: string, courseId: string) {
    const item = await this.prisma.cartItem.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (!item) throw new NotFoundException('El curso no está en el carrito');

    await this.prisma.cartItem.delete({
      where: { userId_courseId: { userId, courseId } },
    });

    return { message: 'Curso eliminado del carrito' };
  }

  async clearCart(userId: string) {
    await this.prisma.cartItem.deleteMany({ where: { userId } });
    return { message: 'Carrito vaciado' };
  }
}
