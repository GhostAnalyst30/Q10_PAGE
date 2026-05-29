import { Controller, Post, Body } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatRequestDto } from './dto/chat-request.dto';

@Controller('chatbot')
export class ChatbotController {
  constructor(private chatbotService: ChatbotService) {}

  @Post('recommend')
  async recommend(@Body() dto: ChatRequestDto) {
    return this.chatbotService.recommend(dto.cartCourseIds || [], dto.message);
  }
}
