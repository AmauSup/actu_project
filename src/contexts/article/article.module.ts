import { Module } from '@nestjs/common' ;
import { ArticleService, AuthorService, CategoryService } from './article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorCredentialsEntity } from '../entities/authorCredentials.entity';
import { ArticleCredentialsEntity } from '../entities/articleCredentials.entity';
import { CategoryCredentialsEntity } from '../entities/categoryCredentials.entity';
import { ArticleController, AuthorController, CategoryController } from './article.controller';

import { ARTICLE_REPOSITORY, AUTHOR_REPOSITORY, CATEGORY_REPOSITORY } from './article.repository.interface';
import { ArticleRepository, AuthorRepository, CategoryRepository } from './article.repository';
import { NewsApiModule } from 'src/core/newsapi/newsapi.module';
import { PresenterService } from 'src/presenter.service';

@Module({
    imports: [
      TypeOrmModule.forFeature([
        AuthorCredentialsEntity,
        ArticleCredentialsEntity,
        CategoryCredentialsEntity
      ]),
      NewsApiModule,
    ],
    controllers:[ArticleController, AuthorController, CategoryController],
    providers: [
        PresenterService,
        ArticleService,
        {
          provide: ARTICLE_REPOSITORY,
          useClass: ArticleRepository,
        },
        AuthorService,
        {
          provide: AUTHOR_REPOSITORY,
          useClass: AuthorRepository,
        },
        CategoryService,
        {
          provide: CATEGORY_REPOSITORY,
          useClass: CategoryRepository,
        }
      ],
      
    exports: [ArticleService, AuthorService, CategoryService]
})

export class ArticleModule {}
