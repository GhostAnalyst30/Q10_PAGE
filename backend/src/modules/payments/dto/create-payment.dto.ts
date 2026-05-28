import { IsString, IsNumber } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  courseId: string;

  @IsString()
  gateway: 'stripe' | 'wompi';
}
