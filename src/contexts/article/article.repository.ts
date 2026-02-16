

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleCredentialsEntity } from '../entities/articleCredentials.entity';
import { AuthorCredentialsEntity } from '../entities/authorCredentials.entity';
import { IArticleRepository, IAuthorRepository } from './article.repository.interface';
import { Repository } from 'typeorm';

@Injectable()
export class ArticleRepository implements IArticleRepository {
  constructor(
    @InjectRepository(ArticleCredentialsEntity) 
    private readonly articleCredentialRepository: Repository<ArticleCredentialsEntity>,
  ) {}

  async createArticle(articleData: Partial<ArticleCredentialsEntity>): Promise<ArticleCredentialsEntity> {
    const article = this.articleCredentialRepository.create(articleData);
    return this.articleCredentialRepository.save(article);
  }

  async findArticleById(id: string): Promise<ArticleCredentialsEntity | null> {
    return this.articleCredentialRepository.findOne({
      where: { id },
      relations: ['author'],
    });
  }

  async findAllArticles(): Promise<ArticleCredentialsEntity[]> {
    return this.articleCredentialRepository.find({
      relations: ['author'],
    });
  }

  async findArticlesByAuthor(authorId: string): Promise<ArticleCredentialsEntity[]> {
    return this.articleCredentialRepository.find({
      where: { author: { id: authorId } },
      relations: ['author'],
    });
  }

  async updateArticle(id: string, articleData: Partial<ArticleCredentialsEntity>): Promise<ArticleCredentialsEntity> {
    await this.articleCredentialRepository.update(id, articleData);
    const updatedArticle = await this.findArticleById(id);
    if (!updatedArticle) {
      throw new Error('Article not found after update');
    }
    return updatedArticle;
  }

  async deleteArticle(id: string): Promise<boolean> {
    const result = await this.articleCredentialRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}

@Injectable()
export class AuthorRepository implements IAuthorRepository {
  constructor(
    @InjectRepository(AuthorCredentialsEntity) 
    private readonly authorCredentialRepository: Repository<AuthorCredentialsEntity>,
  ) {}

  async createAuthor(authorData: Partial<AuthorCredentialsEntity>): Promise<AuthorCredentialsEntity> {
    const author = this.authorCredentialRepository.create(authorData);
    return this.authorCredentialRepository.save(author);
  }

  async findAuthorById(id: string): Promise<AuthorCredentialsEntity | null> {
    return this.authorCredentialRepository.findOne({
      where: { id },
      relations: ['articles'],
    });
  }

  async findAllAuthors(): Promise<AuthorCredentialsEntity[]> {
    return this.authorCredentialRepository.find({
      relations: ['articles'],
    });
  }

  async updateAuthor(id: string, authorData: Partial<AuthorCredentialsEntity>): Promise<AuthorCredentialsEntity> {
    await this.authorCredentialRepository.update(id, authorData);
    const updatedAuthor = await this.findAuthorById(id);
    if (!updatedAuthor) {
      throw new Error('Author not found after update');
    }
    return updatedAuthor;
  }

  async deleteAuthor(id: string): Promise<boolean> {
    const result = await this.authorCredentialRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
