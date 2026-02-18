import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ArticleService, AuthorService, CategoryService } from './article.service';
import { CreateArticleDTO, UpdateArticleDTO, CreateAuthorDTO, UpdateAuthorDTO, CreateCategoryDTO, UpdateCategoryDTO, ImportArticlesDTO } from './article.types';
import { ApiTokenGuard } from 'src/core/http/guards/api-token.guard';

@Controller('articles')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly authorService: AuthorService,
  ) {}

  
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(ApiTokenGuard)
  createArticle(@Body() body: CreateArticleDTO) {
    return this.articleService.createArticle(body);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  getAllArticles(@Query('page') page?: string, @Query('pageSize') pageSize?: string) {
    const pageNumber = Math.max(1, Number(page ?? 1));
    const pageSizeNumber = Math.max(1, Number(pageSize ?? 10));
    return this.articleService.getAllArticles(pageNumber, pageSizeNumber);
  }

  @Get('author/:authorId')
  @HttpCode(HttpStatus.OK)
  getArticlesByAuthor(@Param('authorId') authorId: string) {
    return this.articleService.getArticlesByAuthor(Number(authorId));
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getArticleById(@Param('id') id: string) {
    return this.articleService.getArticleById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiTokenGuard)
  updateArticle(@Param('id') id: string, @Body() body: UpdateArticleDTO) {
    return this.articleService.updateArticle(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiTokenGuard)
  deleteArticle(@Param('id') id: string) {
    return this.articleService.deleteArticle(id);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiTokenGuard)
  deleteAllArticles() {
    return this.articleService.deleteAllArticles();
  }

  @Post('import/newsapi')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(ApiTokenGuard)
  importFromNewsAPI(@Body() body: ImportArticlesDTO) {
    return this.articleService.importArticlesFromNewsAPI(
      body.count,
      body.category,
      body.searchQuery,
    );
  }
}

@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(ApiTokenGuard)
  createAuthor(@Body() body: CreateAuthorDTO) {
    return this.authorService.createAuthor(body);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  getAllAuthors(@Query('page') page?: string, @Query('pageSize') pageSize?: string) {
    const pageNumber = Math.max(1, Number(page ?? 1));
    const pageSizeNumber = Math.max(1, Number(pageSize ?? 10));
    return this.authorService.getAllAuthors(pageNumber, pageSizeNumber);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getAuthorById(@Param('id') id: string) {
    return this.authorService.getAuthorById(Number(id));
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiTokenGuard)
  updateAuthor(@Param('id') id: string, @Body() body: UpdateAuthorDTO) {
    return this.authorService.updateAuthor(Number(id), body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiTokenGuard)
  deleteAuthor(@Param('id') id: string) {
    return this.authorService.deleteAuthor(Number(id));
  }
}

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(ApiTokenGuard)
  createCategory(@Body() body: CreateCategoryDTO) {
    return this.categoryService.createCategory(body);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  getAllCategories(@Query('page') page?: string, @Query('pageSize') pageSize?: string) {
    const pageNumber = Math.max(1, Number(page ?? 1));
    const pageSizeNumber = Math.max(1, Number(pageSize ?? 10));
    return this.categoryService.getAllCategories(pageNumber, pageSizeNumber);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getCategoryById(@Param('id') id: string) {
    return this.categoryService.getCategoryById(Number(id));
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiTokenGuard)
  updateCategory(@Param('id') id: string, @Body() body: UpdateCategoryDTO) {
    return this.categoryService.updateCategory(Number(id), body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiTokenGuard)
  deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(Number(id));
  }

  @Post('newsapi-categories')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(ApiTokenGuard)
  createNewsApiCategories() {
    return this.categoryService.createNewsApiCategories();
  }
}
