

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleCredentialsEntity } from '../entities/articleCredentials.entity';
import { AuthorCredentialsEntity } from '../entities/authorCredentials.entity';
import { CategoryCredentialsEntity } from '../entities/categoryCredentials.entity';
import { IArticleRepository, IAuthorRepository, ICategoryRepository } from './article.repository.interface';
import { In, Repository } from 'typeorm';

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
      relations: ['author', 'categories'],
    });
  }

  async findAllArticles(): Promise<ArticleCredentialsEntity[]> {
    return this.articleCredentialRepository.find({
      relations: ['author', 'categories'],
    });
  }

  async findAllArticlesPaginated(page: number, pageSize: number): Promise<{ items: ArticleCredentialsEntity[]; total: number }> {
    const [items, total] = await this.articleCredentialRepository.findAndCount({
      relations: ['author', 'categories'],
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });

    return { items, total };
  }

  async findArticlesByAuthor(authorId: number): Promise<ArticleCredentialsEntity[]> {
    return this.articleCredentialRepository.find({
      where: { author: { id: authorId } },
      relations: ['author', 'categories'],
    });
  }

  async findArticleByName(name: string): Promise<ArticleCredentialsEntity | null> {
    return this.articleCredentialRepository.findOne({
      where: { name },
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

  async deleteAllArticles(): Promise<number> {
    const result = await this.articleCredentialRepository.delete({});
    return result.affected ?? 0;
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

  async findAuthorById(id: number): Promise<AuthorCredentialsEntity | null> {
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

  async findAllAuthorsPaginated(page: number, pageSize: number): Promise<{ items: AuthorCredentialsEntity[]; total: number }> {
    const [items, total] = await this.authorCredentialRepository.findAndCount({
      relations: ['articles'],
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { id: 'ASC' },
    });

    return { items, total };
  }

  async findAuthorByName(firstName: string, lastName: string): Promise<AuthorCredentialsEntity | null> {
    return this.authorCredentialRepository.findOne({
      where: { autor_first_name: firstName, autor_last_name: lastName },
    });
  }

  async updateAuthor(id: number, authorData: Partial<AuthorCredentialsEntity>): Promise<AuthorCredentialsEntity> {
    await this.authorCredentialRepository.update(id, authorData);
    const updatedAuthor = await this.findAuthorById(id);
    if (!updatedAuthor) {
      throw new Error('Author not found after update');
    }
    return updatedAuthor;
  }

  async deleteAuthor(id: number): Promise<boolean> {
    const result = await this.authorCredentialRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(
    @InjectRepository(CategoryCredentialsEntity)
    private readonly categoryRepository: Repository<CategoryCredentialsEntity>,
  ) {}

  async findCategoriesByIds(ids: number[]): Promise<CategoryCredentialsEntity[]> {
    if (ids.length === 0) {
      return [];
    }

    return this.categoryRepository.find({
      where: { id: In(ids) },
    });
  }

  async findCategoryById(id: number): Promise<CategoryCredentialsEntity | null> {
    return this.categoryRepository.findOne({
      where: { id },
    });
  }

  async findCategoryByName(name: string): Promise<CategoryCredentialsEntity | null> {
    return this.categoryRepository.findOne({
      where: { name },
    });
  }

  async findCategoryBySlug(slug: string): Promise<CategoryCredentialsEntity | null> {
    return this.categoryRepository.findOne({
      where: { slug },
    });
  }

  async findAllCategories(): Promise<CategoryCredentialsEntity[]> {
    return this.categoryRepository.find({
      order: { id: 'DESC' },
    });
  }

  async findAllCategoriesPaginated(page: number, pageSize: number): Promise<{ items: CategoryCredentialsEntity[]; total: number }> {
    const [items, total] = await this.categoryRepository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { id: 'DESC' },
    });

    return { items, total };
  }

  async createCategory(categoryData: Partial<CategoryCredentialsEntity>): Promise<CategoryCredentialsEntity> {
    const category = this.categoryRepository.create(categoryData);
    return this.categoryRepository.save(category);
  }

  async updateCategory(id: number, categoryData: Partial<CategoryCredentialsEntity>): Promise<CategoryCredentialsEntity> {
    await this.categoryRepository.update(id, categoryData);
    const updated = await this.findCategoryById(id);
    if (!updated) {
      throw new Error('Category not found after update');
    }
    return updated;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await this.categoryRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
