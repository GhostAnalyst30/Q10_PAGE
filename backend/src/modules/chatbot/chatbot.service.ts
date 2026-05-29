import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);
  private readonly model = 'mistralai/mistral-7b-instruct';

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  private sanitize(text: string): string {
    return text.replace(/[<>]/g, '').slice(0, 200);
  }

  async recommend(cartCourseIds: string[], message: string) {
    const apiKey = this.configService.get('OPENROUTER_API_KEY');
    this.logger.log(`OPENROUTER_API_KEY present: ${!!apiKey}`);
    if (!apiKey) {
      throw new HttpException(
        'OPENROUTER_API_KEY no configurada en el servidor',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    const allCourses = await this.prisma.course.findMany({
      where: { isActive: true },
    });

    const cartCourses = allCourses.filter((c) => cartCourseIds.includes(c.id));
    const availableCourses = allCourses.filter((c) => !cartCourseIds.includes(c.id));

    const cartContext =
      cartCourses.length > 0
        ? `El usuario tiene estos cursos en su carrito:\n${cartCourses
            .map(
              (c) =>
                `- "${c.title}" (Categoría: ${c.category || 'General'}). Qué aprenderá: ${this.sanitize(c.whatYouLearn || c.shortDesc || c.description)}`,
            )
            .join('\n')}`
        : 'El usuario no tiene cursos en su carrito.';

    const catalogContext = `Cursos disponibles:\n${availableCourses
      .map(
        (c) =>
          `- "${c.title}" (Categoría: ${c.category || 'General'}). Resumen: ${this.sanitize(c.shortDesc || c.description)}. Precio: $${c.price}`,
      )
      .slice(0, 30)
      .join('\n')}`;

    const systemPrompt = `Eres un asesor educativo experto en recomendar cursos online. Respondes en español de forma clara, concisa y amigable. Tu objetivo es ayudar al usuario a elegir los mejores cursos según sus intereses.

${cartContext}

${catalogContext}

Basado en esta informacion:
- Si el usuario tiene cursos en su carrito, recomienda 1-3 cursos complementarios de la lista disponible y explica por qué son útiles.
- Si no tiene cursos en su carrito, responde la pregunta del usuario sobre los cursos, ayudándole a decidir.
- Siempre menciona el nombre exacto del curso que recomiendas.
- Sé breve, máximo 3-4 oraciones.`;

    try {
      const response = await fetch(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': this.configService.get('FRONTEND_URL', 'http://localhost:3000'),
          },
          body: JSON.stringify({
            model: this.model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: message },
            ],
            max_tokens: 500,
            temperature: 0.7,
          }),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        this.logger.error(`OpenRouter HTTP ${response.status}: ${JSON.stringify(data)}`);
        throw new Error(data.error?.message || `HTTP ${response.status}`);
      }

      return {
        reply: data.choices?.[0]?.message?.content || 'Lo siento, no pude generar una respuesta.',
        model: this.model,
      };
    } catch (e) {
      this.logger.error(`Chatbot error: ${(e as Error).message}`);
      throw new HttpException(
        (e as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
