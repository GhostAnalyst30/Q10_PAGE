import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private enrollmentsService: EnrollmentsService) {}

  @Get('my-courses')
  @UseGuards(JwtAuthGuard)
  getMyCourses(@CurrentUser('id') userId: string) {
    return this.enrollmentsService.getUserEnrollments(userId);
  }

  @Get(':courseId')
  @UseGuards(JwtAuthGuard)
  getEnrollment(
    @CurrentUser('id') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.enrollmentsService.getEnrollment(userId, courseId);
  }
}
