export class CategoryAddedEvent {
  constructor(
    public readonly categoryId: string,
    public readonly categoryName: string,
    public readonly categoryDescription: string | null,
    public readonly categorySlug: string,
    public readonly createdAt: Date,
    public readonly categoryUrl?: string,
  ) {}
}
