import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Headers,
  UseGuards,
  RawBodyRequest,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('create-stripe')
  @UseGuards(JwtAuthGuard)
  createStripePayment(
    @CurrentUser('id') userId: string,
    @Body() dto: CreatePaymentDto,
  ) {
    return this.paymentsService.createStripePayment(userId, dto.courseId);
  }

  @Post('create-wompi')
  @UseGuards(JwtAuthGuard)
  createWompiPayment(
    @CurrentUser('id') userId: string,
    @Body() dto: CreatePaymentDto,
  ) {
    return this.paymentsService.createWompiPayment(userId, dto.courseId);
  }

  @Post('webhook/stripe')
  handleStripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.paymentsService.handleStripeWebhook(req.rawBody!, signature);
  }

  @Post('webhook/wompi')
  handleWompiWebhook(@Body() body: any) {
    return this.paymentsService.handleWompiWebhook(body);
  }

  @Get('my-payments')
  @UseGuards(JwtAuthGuard)
  getMyPayments(@CurrentUser('id') userId: string) {
    return this.paymentsService.getUserPayments(userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    return this.paymentsService.findAll({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      status,
    });
  }
}
