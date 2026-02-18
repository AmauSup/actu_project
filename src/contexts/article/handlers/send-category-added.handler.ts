import { Injectable, Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MAILER, MailerPort } from '../../../core/mailer/mailer.port';
import { getCategoryAddedTemplate } from '../../mailer-templates/category-added.template';
import { CategoryAddedEvent } from '../events/category-added.event';


@Injectable()
export class SendCategoryAddedHandler {
  constructor(@Inject(MAILER) private readonly mailer: MailerPort) {}

  @OnEvent('category.added')
  async handle(event: CategoryAddedEvent) {
    try {
      const notificationEmail = process.env.NOTIFICATION_EMAIL || 'admin@example.com';

      const template = getCategoryAddedTemplate({
        recipientName: 'Admin',
        recipientEmail: notificationEmail,
        categoryName: event.categoryName,
        categoryDescription: event.categoryDescription || '',
        categorySlug: event.categorySlug,
        createdAt: event.createdAt,
        categoryUrl: event.categoryUrl || `https://example.com/categories/${event.categorySlug}`,
      });

      await this.mailer.sendMail({
        to: notificationEmail,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      console.log(`Email catégorie ajoutée envoyé à ${notificationEmail}`);
    } catch (error) {
      console.error(`Erreur envoi email catégorie ajoutée: ${error}`);
      throw error;
    }
  }
}
