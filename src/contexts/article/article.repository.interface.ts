import  { AuthorCredentialsEntity } from '../entities/authorCredentials.entity';
import { ArticleCredentialsEntity } from '../entities/articleCredentials.entity'; 
export const ARTICLE_REPOSITORY = Symbol('ARTICLE_REPOSITORY')

export interface IArticleRepository{
    
}

export const AUTHOR_REPOSITORY = Symbol('AUTHOR_REPOSITORY')

export interface IAuthorRepository{
}