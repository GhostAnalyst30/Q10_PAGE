import { IsString, IsNumber, Min } from 'class-validator';

export class UpdateRateDto {
  @IsString()
  currency: string;

  @IsNumber()
  @Min(0)
  rate: number;
}
