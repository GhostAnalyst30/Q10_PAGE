import { IsString, IsOptional, IsArray } from 'class-validator';

export class ChatRequestDto {
  @IsString()
  message: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cartCourseIds?: string[];
}
