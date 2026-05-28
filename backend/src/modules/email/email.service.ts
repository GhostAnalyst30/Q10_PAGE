import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface EmailProvider {
  send(to: string, subject: string, html: string): Promise<void>;
}

class BrevoProvider implements EmailProvider {
  private readonly logger = new Logger('BrevoProvider');

  constructor(
    private apiKey: string,
    private fromName: string,
    private fromEmail: string,
  ) {}

  async send(to: string, subject: string, html: string): Promise<void> {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: this.fromName, email: this.fromEmail },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      this.logger.error(`Brevo error ${res.status}: ${text}`);
      throw new Error(`Brevo API error: ${res.statusText}`);
    }
  }
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private provider: EmailProvider | null = null;

  constructor(private configService: ConfigService) {
    this.initProvider();
  }

  private initProvider() {
    const apiKey = this.configService.get('BREVO_API_KEY');
    if (apiKey && !apiKey.startsWith('xkeysib-...')) {
      const fromName = this.configService.get('EMAIL_FROM_NAME') || 'Q10 Courses';
      const fromEmail = this.configService.get('EMAIL_FROM') || 'noreply@q10courses.com';
      this.provider = new BrevoProvider(apiKey, fromName, fromEmail);
      this.logger.log('Email provider: Brevo');
    } else {
      this.logger.warn('No valid BREVO_API_KEY — emails will be simulated (check .env)');
    }
  }

  async sendWelcomeEmail(email: string, name: string) {
    const html = this.getWelcomeTemplate(name);
    await this.trySend(email, '¡Bienvenido a Q10 Courses!', html);
  }

  async sendPurchaseConfirmation(
    email: string,
    name: string,
    courseTitle: string,
    courseLink?: string,
  ) {
    const html = this.getPurchaseTemplate(name, courseTitle, courseLink);
    await this.trySend(email, `¡Compra exitosa! Accede a ${courseTitle}`, html);
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${token}`;
    const html = this.getResetPasswordTemplate(resetUrl);
    await this.trySend(email, 'Recuperación de contraseña', html);
  }

  async sendCredentialEmail(email: string, name: string, password?: string) {
    const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:'Inter',Arial,sans-serif;background:#0a0a0a;color:#fafafa;margin:0;padding:0;">
<div style="max-width:600px;margin:0 auto;padding:40px 20px;">
<div style="text-align:center;margin-bottom:32px;">
<h1 style="font-size:28px;font-weight:800;background:linear-gradient(135deg,#a855f7,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin:0;">Q10 Courses</h1>
</div>
<div style="background:#1a1a1a;border-radius:16px;padding:40px;border:1px solid #2a2a2a;">
<h2 style="font-size:24px;font-weight:700;margin:0 0 8px;">Tus Credenciales de Acceso</h2>
<p style="color:#a0a0a0;line-height:1.6;margin:16px 0;">Hola ${name},</p>
<p style="color:#a0a0a0;line-height:1.6;">Se han configurado tus credenciales para la plataforma Q10 Courses:</p>
<div style="background:#0a0a0a;border-radius:12px;padding:20px;margin:16px 0;">
<p style="margin:4px 0;color:#a0a0a0;">📧 <strong style="color:#fafafa;">Email:</strong> ${email}</p>
${password ? `<p style="margin:4px 0;color:#a0a0a0;">🔑 <strong style="color:#fafafa;">Contraseña:</strong> ${password}</p>` : ''}
</div>
<a href="${frontendUrl}/login" style="display:inline-block;background:linear-gradient(135deg,#a855f7,#3b82f6);color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:600;font-size:16px;margin-top:16px;">Iniciar Sesión</a>
<p style="color:#525252;font-size:14px;margin-top:24px;">Si no solicitaste este acceso, ignora este correo.</p>
</div>
<p style="color:#525252;font-size:12px;text-align:center;margin-top:32px;">© 2026 Q10 Courses</p>
</div>
</body>
</html>`;
    await this.trySend(email, 'Tus credenciales de acceso - Q10 Courses', html);
  }

  async sendQ10CredentialsEmail(email: string, name: string, q10User: string, q10Pass: string, courses: { title: string; link: string | null }[]) {
    const courseList = courses.map(c =>
      `<p style="margin:4px 0;color:#a0a0a0;">📚 ${c.title} — ${c.link ? `<a href="${c.link}" style="color:#a855f7;">Ir al curso</a>` : '<span style="color:#525252;">Sin enlace</span>'}</p>`
    ).join('');

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:'Inter',Arial,sans-serif;background:#0a0a0a;color:#fafafa;margin:0;padding:0;">
<div style="max-width:600px;margin:0 auto;padding:40px 20px;">
<div style="text-align:center;margin-bottom:32px;">
<h1 style="font-size:28px;font-weight:800;background:linear-gradient(135deg,#a855f7,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin:0;">Q10 Courses</h1>
</div>
<div style="background:#1a1a1a;border-radius:16px;padding:40px;border:1px solid #2a2a2a;">
<h2 style="font-size:24px;font-weight:700;margin:0 0 8px;">Credenciales Q10</h2>
<p style="color:#a0a0a0;line-height:1.6;margin:16px 0;">Hola ${name},</p>
<p style="color:#a0a0a0;line-height:1.6;">Tus credenciales para acceder a los cursos en Q10 son:</p>
<div style="background:#0a0a0a;border-radius:12px;padding:20px;margin:16px 0;">
<p style="margin:4px 0;color:#a0a0a0;">👤 <strong style="color:#fafafa;">Usuario Q10:</strong> ${q10User}</p>
<p style="margin:4px 0;color:#a0a0a0;">🔑 <strong style="color:#fafafa;">Contraseña Q10:</strong> ${q10Pass}</p>
</div>
<p style="color:#a0a0a0;margin:16px 0 8px;font-weight:600;">Tus cursos:</p>
${courseList}
</div>
<p style="color:#525252;font-size:12px;text-align:center;margin-top:32px;">© 2026 Q10 Courses</p>
</div>
</body>
</html>`;
    await this.trySend(email, 'Tus credenciales de Q10 - Q10 Courses', html);
  }

  async sendAccessGrantedEmail(email: string, name: string, courseTitle: string, courseLink: string) {
    const html = this.getAccessGrantedTemplate(name, courseTitle, courseLink);
    await this.trySend(email, `Acceso concedido a ${courseTitle}`, html);
  }

  private async trySend(to: string, subject: string, html: string) {
    if (!this.provider) {
      this.logger.log(`[SIMULATED] To: ${to}, Subject: ${subject}`);
      return;
    }
    try {
      await this.provider.send(to, subject, html);
      this.logger.log(`Email sent to ${to}: ${subject}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${error}`);
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
