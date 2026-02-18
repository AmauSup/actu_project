import { Injectable, Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MAILER, MailerPort } from '../../../core/mailer/mailer.port';
import { getArticleUpdatedTemplate } from '../../mailer-templates/article-updated.template';
import { ArticleUpdatedEvent } from '../events/article-updated.event';


@Injectable()
export class SendArticleUpdatedHandler {
  constructor(@Inject(MAILER) private readonly mailer: MailerPort) {}

  @OnEvent('article.updated')
  async handle(event: ArticleUpdatedEvent) {
    try {
      if (!event.authorEmail) {
        console.warn('No author email for article update notification');
        return;
      }

      const template = getArticleUpdatedTemplate({
        recipientName: event.authorName,
        recipientEmail: event.authorEmail,
        articleTitle: event.articleTitle,
        updateSummary: event.updateSummary,
        articleUrl: event.articleUrl || `https://example.com/articles/${event.articleId}`,
        updatedAt: event.updatedAt || new Date(),
        authorName: event.authorName,
      });

      await this.mailer.sendMail({
        to: event.authorEmail,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      console.log(`Email article mis à jour envoyé à ${event.authorEmail}`);
    } catch (error) {
      console.error(`Erreur envoi email article mis à jour: ${error}`);
      throw error;
    }
  }
}
