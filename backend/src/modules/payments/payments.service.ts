import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import Stripe from 'stripe';
import { EmailService } from '../email/email.service';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY')!, {
      apiVersion: '2024-06-20',
    });
  }

  async createStripePayment(userId: string, courseId: string) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Curso no encontrado');

    const existing = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (existing && existing.paymentStatus === 'APPROVED') {
      throw new BadRequestException('Ya tienes acceso a este curso');
    }

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: course.title,
              description: course.shortDesc || course.description,
            },
            unit_amount: Math.round(course.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${this.configService.get('FRONTEND_URL')}/dashboard/my-courses?success=true`,
      cancel_url: `${this.configService.get('FRONTEND_URL')}/courses/${course.slug}?canceled=true`,
      metadata: {
        userId,
        courseId,
      },
    });

    return { url: session.url, sessionId: session.id };
  }

  async handleStripeWebhook(rawBody: Buffer, signature: string) {
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET')!;

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch {
      throw new BadRequestException('Firma del webhook inválida');
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const { userId, courseId } = session.metadata as any;
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      const course = await this.prisma.course.findUnique({ where: { id: courseId } });

      if (user && course) {
        await this.prisma.$transaction([
          this.prisma.payment.create({
            data: {
              userId,
              amount: course.price,
              currency: 'USD',
              status: 'APPROVED',
              transactionId: session.id,
              gateway: 'stripe',
            },
          }),
          this.prisma.enrollment.upsert({
            where: { userId_courseId: { userId, courseId } },
            update: { paymentStatus: 'APPROVED', accessGranted: true },
            create: {
              userId,
              courseId,
              paymentStatus: 'APPROVED',
              accessGranted: true,
            },
          }),
        ]);

        await this.emailService.sendPurchaseConfirmation(user.email, user.name, course.title, course.q10Link ?? undefined);
      }
    }

    return { received: true };
  }

  async handleWompiWebhook(body: any) {
    const { data, signature } = body;
    const eventSecret = this.configService.get('WOMPI_EVENTS_KEY')!;

    const isValid = signature === eventSecret;
    if (!isValid) throw new BadRequestException('Firma del webhook inválida');

    if (data?.transaction?.status === 'APPROVED') {
      const { userId, courseId } = data.transaction.reference;
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      const course = await this.prisma.course.findUnique({ where: { id: courseId } });

      if (user && course) {
        await this.prisma.$transaction([
          this.prisma.payment.create({
            data: {
              userId,
              amount: data.transaction.amount_in_cents / 100,
              currency: 'COP',
              status: 'APPROVED',
              transactionId: data.transaction.id,
              gateway: 'wompi',
            },
          }),
          this.prisma.enrollment.upsert({
            where: { userId_courseId: { userId, courseId } },
            update: { paymentStatus: 'APPROVED', accessGranted: true },
            create: {
              userId,
              courseId,
              paymentStatus: 'APPROVED',
              accessGranted: true,
            },
          }),
        ]);

        await this.emailService.sendPurchaseConfirmation(user.email, user.name, course.title, course.q10Link ?? undefined);
      }
    }

    return { received: true };
  }

  async createWompiPayment(userId: string, courseId: string) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Curso no encontrado');

    const existing = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (existing && existing.paymentStatus === 'APPROVED') {
      throw new BadRequestException('Ya tienes acceso a este curso');
    }

    const amountInCents = Math.round(course.price * 100);

    const reference = `${userId}-${courseId}-${Date.now()}`;
    const integritySecret = this.configService.get('WOMPI_INTEGRITY_SECRET') || '';
    const wompiPublicKey = this.configService.get('WOMPI_PUBLIC_KEY') || '';

    const signature = require('crypto')
      .createHash('sha256')
      .update(`${reference}${amountInCents}COP${integritySecret}`)
      .digest('hex');

    return {
      amount: amountInCents,
      currency: 'COP',
      reference,
      signature,
      publicKey: wompiPublicKey,
      redirectUrl: `${this.configService.get('FRONTEND_URL')}/dashboard/my-courses?success=true`,
      courseTitle: course.title,
    };
  }

  async getUserPayments(userId: string) {
    return this.prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll(query: { page?: number; limit?: number; status?: string }) {
    const { page = 1, limit = 20, status } = query;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        skip,
        take: limit,
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.payment.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }
}
