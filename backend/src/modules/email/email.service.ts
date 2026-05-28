import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {}

  async sendWelcomeEmail(email: string, name: string) {
    const html = this.getWelcomeTemplate(name);
    await this.sendEmail(email, '¡Bienvenido a Q10 Courses!', html);
  }

  async sendPurchaseConfirmation(
    email: string,
    name: string,
    courseTitle: string,
    courseLink?: string,
  ) {
    const html = this.getPurchaseTemplate(name, courseTitle, courseLink);
    await this.sendEmail(email, `¡Compra exitosa! Accede a ${courseTitle}`, html);
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${token}`;
    const html = this.getResetPasswordTemplate(resetUrl);
    await this.sendEmail(email, 'Recuperación de contraseña', html);
  }

  async sendCredentialEmail(email: string, name: string) {
    const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: 'Inter', Arial, sans-serif; background: #0a0a0a; color: #fafafa; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 28px; font-weight: 800; background: linear-gradient(135deg, #a855f7, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0;">Q10 Courses</h1>
          </div>
          <div style="background: #1a1a1a; border-radius: 16px; padding: 40px; border: 1px solid #2a2a2a;">
            <h2 style="font-size: 24px; font-weight: 700; margin: 0 0 8px;">Tus Credenciales de Acceso</h2>
            <p style="color: #a0a0a0; line-height: 1.6; margin: 16px 0;">Hola ${name},</p>
            <p style="color: #a0a0a0; line-height: 1.6;">Un administrador ha configurado tu acceso a la plataforma Q10 Courses. Puedes iniciar sesión usando el siguiente enlace:</p>
            <a href="${frontendUrl}/login" style="display: inline-block; background: linear-gradient(135deg, #a855f7, #3b82f6); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; margin-top: 16px;">Iniciar Sesión</a>
            <p style="color: #525252; font-size: 14px; margin-top: 24px;">Si no solicitaste este acceso, ignora este correo.</p>
          </div>
          <p style="color: #525252; font-size: 12px; text-align: center; margin-top: 32px;">© 2026 Q10 Courses</p>
        </div>
      </body>
      </html>
    `;
    await this.sendEmail(email, 'Tus credenciales de acceso - Q10 Courses', html);
  }

  async sendAccessGrantedEmail(email: string, name: string, courseTitle: string, courseLink: string) {
    const html = this.getAccessGrantedTemplate(name, courseTitle, courseLink);
    await this.sendEmail(email, `Acceso concedido a ${courseTitle}`, html);
  }

  private async sendEmail(to: string, subject: string, html: string) {
    try {
      const apiKey = this.configService.get('RESEND_API_KEY');

      if (!apiKey || apiKey === 're_...') {
        this.logger.log(`[EMAIL SIMULATED] To: ${to}, Subject: ${subject}`);
        return;
      }

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: this.configService.get('EMAIL_FROM') || 'noreply@q10courses.com',
          to,
          subject,
          html,
        }),
      });

      if (!res.ok) {
        this.logger.error(`Error sending email: ${res.statusText}`);
      }
    } catch (error) {
      this.logger.error('Failed to send email', error);
    }
  }

  private getWelcomeTemplate(name: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: 'Inter', Arial, sans-serif; background: #0a0a0a; color: #fafafa; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 28px; font-weight: 800; background: linear-gradient(135deg, #a855f7, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0;">Q10 Courses</h1>
          </div>
          <div style="background: #1a1a1a; border-radius: 16px; padding: 40px; border: 1px solid #2a2a2a;">
            <h2 style="font-size: 24px; font-weight: 700; margin: 0 0 8px;">¡Bienvenido, ${name}!</h2>
            <p style="color: #a0a0a0; line-height: 1.6; margin: 16px 0;">Gracias por registrarte en Q10 Courses. Estamos emocionados de tenerte a bordo. Explora nuestros cursos y comienza a aprender hoy.</p>
            <a href="${this.configService.get('FRONTEND_URL')}/courses" style="display: inline-block; background: linear-gradient(135deg, #a855f7, #3b82f6); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; margin-top: 16px;">Explorar Cursos</a>
          </div>
          <p style="color: #525252; font-size: 12px; text-align: center; margin-top: 32px;">© 2026 Q10 Courses. Todos los derechos reservados.</p>
        </div>
      </body>
      </html>
    `;
  }

  private getPurchaseTemplate(name: string, courseTitle: string, courseLink?: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: 'Inter', Arial, sans-serif; background: #0a0a0a; color: #fafafa; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 28px; font-weight: 800; background: linear-gradient(135deg, #a855f7, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0;">Q10 Courses</h1>
          </div>
          <div style="background: #1a1a1a; border-radius: 16px; padding: 40px; border: 1px solid #2a2a2a;">
            <h2 style="font-size: 24px; font-weight: 700; margin: 0 0 8px;">¡Compra Exitosa!</h2>
            <p style="color: #a0a0a0; line-height: 1.6; margin: 16px 0;">Hola ${name},</p>
            <p style="color: #a0a0a0; line-height: 1.6;">Tu acceso al curso <strong style="color: #fafafa;">${courseTitle}</strong> ha sido confirmado.</p>
            ${courseLink ? `<a href="${courseLink}" style="display: inline-block; background: linear-gradient(135deg, #a855f7, #3b82f6); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; margin-top: 16px;">Ir al Curso</a>` : ''}
          </div>
          <p style="color: #525252; font-size: 12px; text-align: center; margin-top: 32px;">© 2026 Q10 Courses</p>
        </div>
      </body>
      </html>
    `;
  }

  private getResetPasswordTemplate(resetUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: 'Inter', Arial, sans-serif; background: #0a0a0a; color: #fafafa; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: #1a1a1a; border-radius: 16px; padding: 40px; border: 1px solid #2a2a2a;">
            <h2 style="font-size: 24px; font-weight: 700; margin: 0 0 8px;">Recuperar Contraseña</h2>
            <p style="color: #a0a0a0; line-height: 1.6; margin: 16px 0;">Recibimos una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para crear una nueva.</p>
            <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #a855f7, #3b82f6); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; margin-top: 16px;">Restablecer Contraseña</a>
            <p style="color: #525252; font-size: 14px; margin-top: 24px;">Si no solicitaste esto, ignora este correo. El enlace expira en 1 hora.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getAccessGrantedTemplate(name: string, courseTitle: string, courseLink: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: 'Inter', Arial, sans-serif; background: #0a0a0a; color: #fafafa; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: #1a1a1a; border-radius: 16px; padding: 40px; border: 1px solid #2a2a2a;">
            <h2 style="font-size: 24px; font-weight: 700; margin: 0 0 8px;">Acceso Concedido</h2>
            <p style="color: #a0a0a0; line-height: 1.6; margin: 16px 0;">Hola ${name}, tu acceso a <strong style="color: #fafafa;">${courseTitle}</strong> ha sido aprobado.</p>
            <a href="${courseLink}" style="display: inline-block; background: linear-gradient(135deg, #a855f7, #3b82f6); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; margin-top: 16px;">Acceder al Curso</a>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
