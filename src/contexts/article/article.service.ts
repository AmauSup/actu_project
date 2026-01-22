


import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ARTICLE_REPOSITORY } from './article.repository.interface';
import type { IArticleRepository } from './article.repository.interface';
import { AUTHOR_REPOSITORY } from './article.repository.interface';
import type { IAuthorRepository } from './article.repository.interface'

@Injectable()
export class ArticleService {
  constructor(
    @Inject(ARTICLE_REPOSITORY) private readonly articleRepo: IArticleRepository,
  ) {}


}
@Injectable()
export class AuthorService {
  constructor(
    @Inject(AUTHOR_REPOSITORY) private readonly authorRepo: IAuthorRepository,
  ) {}

}
