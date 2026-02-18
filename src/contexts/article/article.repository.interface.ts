import { AuthorCredentialsEntity } from '../entities/authorCredentials.entity';
import { ArticleCredentialsEntity } from '../entities/articleCredentials.entity';
import { CategoryCredentialsEntity } from '../entities/categoryCredentials.entity';
export const ARTICLE_REPOSITORY = Symbol('ARTICLE_REPOSITORY')

export interface IArticleRepository{
    createArticle(articleData: Partial<ArticleCredentialsEntity>): Promise<ArticleCredentialsEntity>
    findArticleById(id: string): Promise<ArticleCredentialsEntity | null>
    findAllArticles(): Promise<ArticleCredentialsEntity[]>
    findAllArticlesPaginated(page: number, pageSize: number): Promise<{ items: ArticleCredentialsEntity[]; total: number }>
    findArticlesByAuthor(authorId: number): Promise<ArticleCredentialsEntity[]>
    findArticleByName(name: string): Promise<ArticleCredentialsEntity | null>
    updateArticle(id: string, articleData: Partial<ArticleCredentialsEntity>): Promise<ArticleCredentialsEntity>
    deleteArticle(id: string): Promise<boolean>
    deleteAllArticles(): Promise<number>
}

export const AUTHOR_REPOSITORY = Symbol('AUTHOR_REPOSITORY')

export interface IAuthorRepository{
    createAuthor(authorData: Partial<AuthorCredentialsEntity>): Promise<AuthorCredentialsEntity>
    findAuthorById(id: number): Promise<AuthorCredentialsEntity | null>
    findAllAuthors(): Promise<AuthorCredentialsEntity[]>
    findAllAuthorsPaginated(page: number, pageSize: number): Promise<{ items: AuthorCredentialsEntity[]; total: number }>
    findAuthorByName(firstName: string, lastName: string): Promise<AuthorCredentialsEntity | null>
    updateAuthor(id: number, authorData: Partial<AuthorCredentialsEntity>): Promise<AuthorCredentialsEntity>
    deleteAuthor(id: number): Promise<boolean>
}

export const CATEGORY_REPOSITORY = Symbol('CATEGORY_REPOSITORY')

export interface ICategoryRepository {
    findCategoriesByIds(ids: number[]): Promise<CategoryCredentialsEntity[]>
    findCategoryById(id: number): Promise<CategoryCredentialsEntity | null>
    findCategoryByName(name: string): Promise<CategoryCredentialsEntity | null>
    findCategoryBySlug(slug: string): Promise<CategoryCredentialsEntity | null>
    findAllCategories(): Promise<CategoryCredentialsEntity[]>
    findAllCategoriesPaginated(page: number, pageSize: number): Promise<{ items: CategoryCredentialsEntity[]; total: number }>
    createCategory(categoryData: Partial<CategoryCredentialsEntity>): Promise<CategoryCredentialsEntity>
    updateCategory(id: number, categoryData: Partial<CategoryCredentialsEntity>): Promise<CategoryCredentialsEntity>
    deleteCategory(id: number): Promise<boolean>
}