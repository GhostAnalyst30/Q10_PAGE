import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateCourseDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  shortDesc?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  instructor?: string;

  @IsOptional()
  @IsString()
  whatYouLearn?: string;

  @IsOptional()
  @IsString()
  q10Link?: string;

  @IsOptional()
  isActive?: boolean;
}
