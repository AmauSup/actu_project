export const MAILER = Symbol('MAILER');

export interface MailerPort {
  sendMail(options: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
  }): Promise<void>;
}
