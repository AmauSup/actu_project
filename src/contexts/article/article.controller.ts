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
} from '@nestjs/common';
import { ArticleService, AuthorService } from './article.service';
import { CreateArticleDTO, UpdateArticleDTO, CreateAuthorDTO, UpdateAuthorDTO } from './article.types';

@Controller('articles')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly authorService: AuthorService,
  ) {}

  
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createArticle(@Body() body: CreateArticleDTO) {
    return this.articleService.createArticle(body);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  getAllArticles() {
    return this.articleService.getAllArticles();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getArticleById(@Param('id') id: string) {
    return this.articleService.getArticleById(id);
  }

  @Get('author/:authorId')
  @HttpCode(HttpStatus.OK)
  getArticlesByAuthor(@Param('authorId') authorId: string) {
    return this.articleService.getArticlesByAuthor(authorId);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  updateArticle(@Param('id') id: string, @Body() body: UpdateArticleDTO) {
    return this.articleService.updateArticle(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deleteArticle(@Param('id') id: string) {
    return this.articleService.deleteArticle(id);
  }
}

@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  // ===== Routes pour Authors =====
  
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createAuthor(@Body() body: CreateAuthorDTO) {
    return this.authorService.createAuthor(body);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  getAllAuthors() {
    return this.authorService.getAllAuthors();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getAuthorById(@Param('id') id: string) {
    return this.authorService.getAuthorById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  updateAuthor(@Param('id') id: string, @Body() body: UpdateAuthorDTO) {
    return this.authorService.updateAuthor(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deleteAuthor(@Param('id') id: string) {
    return this.authorService.deleteAuthor(id);
  }
}
