import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ARTICLE_REPOSITORY, AUTHOR_REPOSITORY, CATEGORY_REPOSITORY } from './article.repository.interface';
import type { IArticleRepository, IAuthorRepository, ICategoryRepository } from './article.repository.interface';
import { CreateArticleDTO, UpdateArticleDTO, CreateAuthorDTO, UpdateAuthorDTO, CreateCategoryDTO, UpdateCategoryDTO } from './article.types';
import { ArticleCredentialsEntity } from '../entities/articleCredentials.entity';
import { AuthorCredentialsEntity } from '../entities/authorCredentials.entity';
import { ArticleAlreadyExists, ArticleNotFound, AuthorAlreadyExists, AuthorHasArticles, AuthorNotFound, CategoryAlreadyExists, CategoryNotFound } from './errors/article.errors';
import { CategoryCredentialsEntity } from '../entities/categoryCredentials.entity';
import { NewsApiService } from 'src/core/newsapi/newsapi.service';

@Injectable()
export class ArticleService {
  constructor(
    @Inject(ARTICLE_REPOSITORY) private readonly articleRepo: IArticleRepository,
    @Inject(AUTHOR_REPOSITORY) private readonly authorRepo: IAuthorRepository,
    @Inject(CATEGORY_REPOSITORY) private readonly categoryRepo: ICategoryRepository,
    private readonly newsApiService: NewsApiService,
  ) {}

  async createArticle(dto: CreateArticleDTO): Promise<ArticleCredentialsEntity> {
    // Vérifier que l'auteur existe
    const author = await this.authorRepo.findAuthorById(dto.authorId);
    if (!author) {
      throw new AuthorNotFound();
    }

    const existingArticle = await this.articleRepo.findArticleByName(dto.name);
    if (existingArticle) {
      throw new ArticleAlreadyExists();
    }

    // Si pas de catégories fournies, récupérer toutes les catégories disponibles pour suggestion
    if (!dto.categoryIds || dto.categoryIds.length === 0) {
      const allCategories = await this.categoryRepo.findAllCategories();
      if (allCategories.length > 0) {
        const categoryList = allCategories.map(cat => `${cat.id}: ${cat.name} (${cat.slug})`).join(', ');
        throw new BadRequestException(`Please select at least one category. Available categories: ${categoryList}`);
      }
      throw new BadRequestException('No categories available. Please create categories first.');
    }

    const categories = await this.categoryRepo.findCategoriesByIds(dto.categoryIds);

    if (categories.length !== dto.categoryIds.length) {
      const foundIds = categories.map(c => c.id);
      const missingIds = dto.categoryIds.filter(id => !foundIds.includes(id));
      throw new CategoryNotFound(missingIds.map(String));
    }

    return this.articleRepo.createArticle({
      name: dto.name,
      description: dto.description,
      content: dto.content,
      imageUrl: dto.imageUrl,
      author: author,
      categories,
    });
  }

  async getAllArticles(page = 1, pageSize = 10): Promise<{ data: ArticleCredentialsEntity[]; meta: { page: number; pageSize: number; total: number; totalPages: number } }> {
    const { items, total } = await this.articleRepo.findAllArticlesPaginated(page, pageSize);
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return {
      data: items,
      meta: {
        page,
        pageSize,
        total,
        totalPages,
      },
    };
  }

  async getArticleById(id: string): Promise<ArticleCredentialsEntity> {
    const article = await this.articleRepo.findArticleById(id);
    if (!article) {
      throw new ArticleNotFound();
    }
    return article;
  }

  async getArticlesByAuthor(authorId: number): Promise<ArticleCredentialsEntity[]> {
    // Vérifier que l'auteur existe
    const author = await this.authorRepo.findAuthorById(authorId);
    if (!author) {
      throw new AuthorNotFound();
    }
    return this.articleRepo.findArticlesByAuthor(authorId);
  }

  async updateArticle(id: string, dto: UpdateArticleDTO): Promise<ArticleCredentialsEntity> {
    const article = await this.articleRepo.findArticleById(id);
    if (!article) {
      throw new ArticleNotFound();
    }

    const updateData: Partial<ArticleCredentialsEntity> = {};

    if (dto.name) updateData.name = dto.name;
    if (dto.description) updateData.description = dto.description;
    if (dto.content) updateData.content = dto.content;
    
    if (dto.authorId) {
      const author = await this.authorRepo.findAuthorById(dto.authorId);
      if (!author) {
        throw new AuthorNotFound();
      }
      updateData.author = author;
    }

    if (dto.categoryIds) {
      const categories = await this.categoryRepo.findCategoriesByIds(dto.categoryIds);
      if (dto.categoryIds.length && categories.length !== dto.categoryIds.length) {
        throw new CategoryNotFound();
      }
      updateData.categories = categories;
    }

    return this.articleRepo.updateArticle(id, updateData);
  }

  async deleteArticle(id: string): Promise<{ deleted: true }> {
    const article = await this.articleRepo.findArticleById(id);
    if (!article) {
      throw new ArticleNotFound();
    }

    const deleted = await this.articleRepo.deleteArticle(id);
    if (!deleted) {
      throw new BadRequestException('Failed to delete article');
    }

    return { deleted: true };
  }

  async deleteAllArticles(): Promise<{ deleted: number }> {
    const count = await this.articleRepo.deleteAllArticles();
    return { deleted: count };
  }


  async importArticlesFromNewsAPI(
    count: number = 10,
    category?: string,
    searchQuery?: string,
  ): Promise<{ imported: number; failed: number; articles: ArticleCredentialsEntity[] }> {
    const newsArticles = await this.newsApiService.getArticles(count, category, searchQuery);
    const imported: ArticleCredentialsEntity[] = [];
    let failed = 0;

    for (const newsArticle of newsArticles) {
      try {
        const mapped = this.newsApiService.mapArticle(newsArticle);

        // Vérifier si l'article existe déjà
        const existingArticle = await this.articleRepo.findArticleByName(mapped.title);
        if (existingArticle) {
          failed++;
          continue;
        }

        // Créer ou trouver l'auteur
        let author = await this.authorRepo.findAuthorByName(
          mapped.authorName.split(' ')[0],
          mapped.authorName.split(' ').slice(1).join(' ') || 'Unknown',
        );

        if (!author) {
          const names = mapped.authorName.split(' ');
          const firstName = names[0];
          const lastName = names.slice(1).join(' ') || 'Unknown';

          author = await this.authorRepo.createAuthor({
            autor_first_name: firstName,
            autor_last_name: lastName,
          });
        }

        // Créer ou trouver la catégorie
        let categoryEntity = await this.categoryRepo.findCategoryByName(mapped.sourceCategory);

        if (!categoryEntity) {
          const slug = mapped.sourceCategory
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');

          categoryEntity = await this.categoryRepo.createCategory({
            name: mapped.sourceCategory,
            slug,
            description: `Articles about ${mapped.sourceCategory}`,
          });
        }

        // Créer l'article
        const article = await this.articleRepo.createArticle({
          name: mapped.title,
          description: mapped.description,
          content: mapped.content,
          imageUrl: mapped.imageUrl || undefined,
          author,
          categories: [categoryEntity],
        });

        imported.push(article);
      } catch (error) {
        failed++;
        console.error(`Failed to import article: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return { imported: imported.length, failed, articles: imported };
  }
}

@Injectable()
export class AuthorService {
  constructor(
    @Inject(AUTHOR_REPOSITORY) private readonly authorRepo: IAuthorRepository,
  ) {}

  async createAuthor(dto: CreateAuthorDTO): Promise<AuthorCredentialsEntity> {
    const existingAuthor = await this.authorRepo.findAuthorByName(dto.autor_first_name, dto.autor_last_name);
    if (existingAuthor) {
      throw new AuthorAlreadyExists();
    }

    return this.authorRepo.createAuthor({
      autor_first_name: dto.autor_first_name,
      autor_last_name: dto.autor_last_name,
    });
  }

  async getAllAuthors(page = 1, pageSize = 10): Promise<{ data: AuthorCredentialsEntity[]; meta: { page: number; pageSize: number; total: number; totalPages: number } }> {
    const { items, total } = await this.authorRepo.findAllAuthorsPaginated(page, pageSize);
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return {
      data: items,
      meta: {
        page,
        pageSize,
        total,
        totalPages,
      },
    };
  }

  async getAuthorById(id: number): Promise<AuthorCredentialsEntity> {
    const author = await this.authorRepo.findAuthorById(id);
    if (!author) {
      throw new AuthorNotFound();
    }
    return author;
  }

  async updateAuthor(id: number, dto: UpdateAuthorDTO): Promise<AuthorCredentialsEntity> {
    const author = await this.authorRepo.findAuthorById(id);
    if (!author) {
      throw new AuthorNotFound();
    }

    const updateData: Partial<AuthorCredentialsEntity> = {};
    
    if (dto.autor_first_name) updateData.autor_first_name = dto.autor_first_name;
    if (dto.autor_last_name) updateData.autor_last_name = dto.autor_last_name;

    return this.authorRepo.updateAuthor(id, updateData);
  }

  async deleteAuthor(id: number): Promise<{ deleted: true }> {
    const author = await this.authorRepo.findAuthorById(id);
    if (!author) {
      throw new AuthorNotFound();
    }

    // Vérifier si l'auteur a des articles
    if (author.articles && author.articles.length > 0) {
      throw new AuthorHasArticles();
    }

    const deleted = await this.authorRepo.deleteAuthor(id);
    if (!deleted) {
      throw new BadRequestException('Failed to delete author');
    }

    return { deleted: true };
  }
}

@Injectable()
export class CategoryService {
  constructor(
    @Inject(CATEGORY_REPOSITORY) private readonly categoryRepo: ICategoryRepository,
  ) {}

  async createCategory(dto: CreateCategoryDTO): Promise<CategoryCredentialsEntity> {
    const byName = await this.categoryRepo.findCategoryByName(dto.name);
    if (byName) {
      throw new CategoryAlreadyExists();
    }

    const bySlug = await this.categoryRepo.findCategoryBySlug(dto.slug);
    if (bySlug) {
      throw new CategoryAlreadyExists();
    }

    return this.categoryRepo.createCategory({
      name: dto.name,
      slug: dto.slug,
      description: dto.description ?? null,
    });
  }

  async getAllCategories(page = 1, pageSize = 10): Promise<{ data: CategoryCredentialsEntity[]; meta: { page: number; pageSize: number; total: number; totalPages: number } }> {
    const { items, total } = await this.categoryRepo.findAllCategoriesPaginated(page, pageSize);
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return {
      data: items,
      meta: {
        page,
        pageSize,
        total,
        totalPages,
      },
    };
  }

  async getCategoryById(id: number): Promise<CategoryCredentialsEntity> {
    const category = await this.categoryRepo.findCategoryById(id);
    if (!category) {
      throw new CategoryNotFound();
    }
    return category;
  }

  async updateCategory(id: number, dto: UpdateCategoryDTO): Promise<CategoryCredentialsEntity> {
    const category = await this.categoryRepo.findCategoryById(id);
    if (!category) {
      throw new CategoryNotFound();
    }

    if (dto.name) {
      const byName = await this.categoryRepo.findCategoryByName(dto.name);
      if (byName && byName.id !== id) {
        throw new CategoryAlreadyExists();
      }
    }

    if (dto.slug) {
      const bySlug = await this.categoryRepo.findCategoryBySlug(dto.slug);
      if (bySlug && bySlug.id !== id) {
        throw new CategoryAlreadyExists();
      }
    }

    return this.categoryRepo.updateCategory(id, {
      name: dto.name ?? category.name,
      slug: dto.slug ?? category.slug,
      description: dto.description ?? category.description ?? null,
    });
  }

  async deleteCategory(id: number): Promise<{ deleted: true }> {
    const category = await this.categoryRepo.findCategoryById(id);
    if (!category) {
      throw new CategoryNotFound();
    }

    const deleted = await this.categoryRepo.deleteCategory(id);
    if (!deleted) {
      throw new BadRequestException('Failed to delete category');
    }

    return { deleted: true };
  }

  async createNewsApiCategories(): Promise<{ created: CategoryCredentialsEntity[]; existing: string[] }> {
    const newsApiCategories = [
      { name: 'Business', slug: 'business', description: 'Business news and financial updates' },
      { name: 'Entertainment', slug: 'entertainment', description: 'Entertainment and celebrity news' },
      { name: 'General', slug: 'general', description: 'General news from around the world' },
      { name: 'Health', slug: 'health', description: 'Health, medicine and wellness news' },
      { name: 'Science', slug: 'science', description: 'Science and technology discoveries' },
      { name: 'Sports', slug: 'sports', description: 'Sports news and updates' },
      { name: 'Technology', slug: 'technology', description: 'Technology and innovation news' },
    ];

    const created: CategoryCredentialsEntity[] = [];
    const existing: string[] = [];

    for (const cat of newsApiCategories) {
      const existingCategory = await this.categoryRepo.findCategoryBySlug(cat.slug);
      
      if (existingCategory) {
        existing.push(cat.name);
        continue;
      }

      const newCategory = await this.categoryRepo.createCategory({
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
      });

      created.push(newCategory);
    }

    return { created, existing };
  }
}