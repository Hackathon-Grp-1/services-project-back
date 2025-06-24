import { Injectable } from '@nestjs/common';
import { ApiConfigService } from '@src/config/services/api-config.service';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter: Transporter;
  private from: string;

  constructor(private readonly configService: ApiConfigService) {
    const mailConfig = this.configService.get('mail');
    this.from = mailConfig?.from || '';
    this.transporter = createTransport({
      host: mailConfig?.host,
      port: mailConfig?.port,
      secure: mailConfig?.secure,
      auth: {
        user: mailConfig?.user,
        pass: mailConfig?.pass,
      },
    });
  }

  async sendMail(options: { to: string; subject: string; text?: string; html?: string }): Promise<void> {
    await this.transporter.sendMail({
      from: this.from,
      ...options,
    });
  }
}
