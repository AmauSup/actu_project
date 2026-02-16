import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';
import { MailerPort } from './mailer.port';

@Injectable()
export class NodemailerService implements MailerPort {
  private readonly transporter: Transporter;
  private readonly fromAddress: string;

  constructor(private readonly config: ConfigService) {
    const host = this.config.get<string>('MAIL_HOST');
    const port = Number(this.config.get<string>('MAIL_PORT') ?? 587);
    const user = this.config.get<string>('MAIL_USER');
    const pass = this.config.get<string>('MAIL_PASS');
    const secure = port === 465;

    if (!host || !user || !pass) {
      throw new Error('Mailer configuration missing: MAIL_HOST, MAIL_USER, MAIL_PASS');
    }

    this.fromAddress = this.config.get<string>('MAIL_FROM') ?? user;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
  }

  async sendMail(options: { to: string; subject: string; text?: string; html?: string }): Promise<void> {
    await this.transporter.sendMail({
      from: this.fromAddress,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
  }
}
