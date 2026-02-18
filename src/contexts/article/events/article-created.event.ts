export class ArticleCreatedEvent {
  constructor(
    public readonly articleId: string,
    public readonly articleTitle: string,
    public readonly articleDescription: string,
    public readonly authorId: string,
    public readonly authorName: string,
    public readonly authorEmail: string,
    public readonly categories: string[],
    public readonly createdAt: Date,
    public readonly articleUrl?: string,
  ) {}
}
