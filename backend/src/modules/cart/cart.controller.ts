import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getCart(@CurrentUser('id') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Post('add')
  @UseGuards(JwtAuthGuard)
  addToCart(@CurrentUser('id') userId: string, @Body('courseId') courseId: string) {
    return this.cartService.addToCart(userId, courseId);
  }

  @Delete(':courseId')
  @UseGuards(JwtAuthGuard)
  removeFromCart(@CurrentUser('id') userId: string, @Param('courseId') courseId: string) {
    return this.cartService.removeFromCart(userId, courseId);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  clearCart(@CurrentUser('id') userId: string) {
    return this.cartService.clearCart(userId);
  }
}
