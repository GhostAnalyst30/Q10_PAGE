import { IsString, IsNumber, IsOptional, Min, MinLength } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  slug: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  shortDesc?: string;

  @IsNumber()
  @Min(0)
  price: number;

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
}
