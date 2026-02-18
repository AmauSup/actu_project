import { Injectable, Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MAILER, MailerPort } from '../../../core/mailer/mailer.port';
import { getArticleCreatedTemplate } from '../../mailer-templates/article-created.template';
import { ArticleCreatedEvent } from '../events/article-created.event';


@Injectable()
export class SendArticleCreatedHandler {
  constructor(@Inject(MAILER) private readonly mailer: MailerPort) {}

  @OnEvent('article.created')
  async handle(event: ArticleCreatedEvent) {
    try {
      const template = getArticleCreatedTemplate({
        authorName: event.authorName,
        authorEmail: event.authorEmail,
        articleTitle: event.articleTitle,
        articleDescription: event.articleDescription,
        articleUrl: event.articleUrl || `https://example.com/articles/${event.articleId}`,
        categories: event.categories,
        createdAt: event.createdAt,
      });

      await this.mailer.sendMail({
        to: event.authorEmail,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      console.log(`Email article créé envoyé à ${event.authorEmail}`);
    } catch (error) {
      console.error(`Erreur envoi email article créé: ${error}`);
      throw error;
    }
  }
}
