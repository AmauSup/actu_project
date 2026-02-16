

import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ARTICLE_REPOSITORY, AUTHOR_REPOSITORY } from './article.repository.interface';
import type { IArticleRepository, IAuthorRepository } from './article.repository.interface';
import { CreateArticleDTO, UpdateArticleDTO, CreateAuthorDTO, UpdateAuthorDTO } from './article.types';
import { ArticleCredentialsEntity } from '../entities/articleCredentials.entity';
import { AuthorCredentialsEntity } from '../entities/authorCredentials.entity';

@Injectable()
export class ArticleService {
  constructor(
    @Inject(ARTICLE_REPOSITORY) private readonly articleRepo: IArticleRepository,
    @Inject(AUTHOR_REPOSITORY) private readonly authorRepo: IAuthorRepository,
  ) {}

  async createArticle(dto: CreateArticleDTO): Promise<ArticleCredentialsEntity> {
    // Vérifier que l'auteur existe
    const author = await this.authorRepo.findAuthorById(dto.authorId);
    if (!author) {
      throw new NotFoundException('Author not found');
    }

    return this.articleRepo.createArticle({
      name: dto.name,
      descrition: dto.description, // Note: typo dans l'entity "descrition"
      content: dto.content,
      categorie: dto.categorie,
      imageUrl: dto.imageUrl,
      author: author,
    });
  }

  async getAllArticles(): Promise<ArticleCredentialsEntity[]> {
    return this.articleRepo.findAllArticles();
  }

  async getArticleById(id: string): Promise<ArticleCredentialsEntity> {
    const article = await this.articleRepo.findArticleById(id);
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  async getArticlesByAuthor(authorId: string): Promise<ArticleCredentialsEntity[]> {
    // Vérifier que l'auteur existe
    const author = await this.authorRepo.findAuthorById(authorId);
    if (!author) {
      throw new NotFoundException('Author not found');
    }
    return this.articleRepo.findArticlesByAuthor(authorId);
  }

  async updateArticle(id: string, dto: UpdateArticleDTO): Promise<ArticleCredentialsEntity> {
    const article = await this.articleRepo.findArticleById(id);
    if (!article) {
      throw new NotFoundException('Article not found');
    }

    const updateData: Partial<ArticleCredentialsEntity> = {};

    if (dto.name) updateData.name = dto.name;
    if (dto.description) updateData.descrition = dto.description; // Note: typo dans l'entity
    if (dto.content) updateData.content = dto.content;
    if (dto.categorie) updateData.categorie = dto.categorie;
    if (dto.imageUrl !== undefined) updateData.imageUrl = dto.imageUrl;
    
    if (dto.authorId) {
      const author = await this.authorRepo.findAuthorById(dto.authorId);
      if (!author) {
        throw new NotFoundException('Author not found');
      }
      updateData.author = author;
    }

    return this.articleRepo.updateArticle(id, updateData);
  }

  async deleteArticle(id: string): Promise<{ deleted: true }> {
    const article = await this.articleRepo.findArticleById(id);
    if (!article) {
      throw new NotFoundException('Article not found');
    }

    const deleted = await this.articleRepo.deleteArticle(id);
    if (!deleted) {
      throw new BadRequestException('Failed to delete article');
    }

    return { deleted: true };
  }
}

@Injectable()
export class AuthorService {
  constructor(
    @Inject(AUTHOR_REPOSITORY) private readonly authorRepo: IAuthorRepository,
  ) {}

  async createAuthor(dto: CreateAuthorDTO): Promise<AuthorCredentialsEntity> {
    return this.authorRepo.createAuthor({
      autor_first_name: dto.autor_first_name,
      autor_last_name: dto.autor_last_name,
    });
  }

  async getAllAuthors(): Promise<AuthorCredentialsEntity[]> {
    return this.authorRepo.findAllAuthors();
  }

  async getAuthorById(id: string): Promise<AuthorCredentialsEntity> {
    const author = await this.authorRepo.findAuthorById(id);
    if (!author) {
      throw new NotFoundException('Author not found');
    }
    return author;
  }

  async updateAuthor(id: string, dto: UpdateAuthorDTO): Promise<AuthorCredentialsEntity> {
    const author = await this.authorRepo.findAuthorById(id);
    if (!author) {
      throw new NotFoundException('Author not found');
    }

    const updateData: Partial<AuthorCredentialsEntity> = {};
    
    if (dto.autor_first_name) updateData.autor_first_name = dto.autor_first_name;
    if (dto.autor_last_name) updateData.autor_last_name = dto.autor_last_name;

    return this.authorRepo.updateAuthor(id, updateData);
  }

  async deleteAuthor(id: string): Promise<{ deleted: true }> {
    const author = await this.authorRepo.findAuthorById(id);
    if (!author) {
      throw new NotFoundException('Author not found');
    }

    // Vérifier si l'auteur a des articles
    if (author.articles && author.articles.length > 0) {
      throw new BadRequestException('Cannot delete author with existing articles');
    }

    const deleted = await this.authorRepo.deleteAuthor(id);
    if (!deleted) {
      throw new BadRequestException('Failed to delete author');
    }

    return { deleted: true };
  }
}
