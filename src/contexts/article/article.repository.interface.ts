import  { AuthorCredentialsEntity } from '../entities/authorCredentials.entity';
import { ArticleCredentialsEntity } from '../entities/articleCredentials.entity'; 
export const ARTICLE_REPOSITORY = Symbol('ARTICLE_REPOSITORY')

export interface IArticleRepository{
    createArticle(articleData: Partial<ArticleCredentialsEntity>): Promise<ArticleCredentialsEntity>
    findArticleById(id: string): Promise<ArticleCredentialsEntity | null>
    findAllArticles(): Promise<ArticleCredentialsEntity[]>
    findArticlesByAuthor(authorId: string): Promise<ArticleCredentialsEntity[]>
    updateArticle(id: string, articleData: Partial<ArticleCredentialsEntity>): Promise<ArticleCredentialsEntity>
    deleteArticle(id: string): Promise<boolean>
}

export const AUTHOR_REPOSITORY = Symbol('AUTHOR_REPOSITORY')

export interface IAuthorRepository{
    createAuthor(authorData: Partial<AuthorCredentialsEntity>): Promise<AuthorCredentialsEntity>
    findAuthorById(id: string): Promise<AuthorCredentialsEntity | null>
    findAllAuthors(): Promise<AuthorCredentialsEntity[]>
    updateAuthor(id: string, authorData: Partial<AuthorCredentialsEntity>): Promise<AuthorCredentialsEntity>
    deleteAuthor(id: string): Promise<boolean>
}