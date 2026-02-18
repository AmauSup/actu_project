export class ArticleUpdatedEvent {
  constructor(
    public readonly articleId: string,
    public readonly articleTitle: string,
    public readonly updateSummary: string,
    public readonly authorName: string,
    public readonly authorEmail?: string,
    public readonly updatedAt?: Date,
    public readonly articleUrl?: string,
  ) {}
}
