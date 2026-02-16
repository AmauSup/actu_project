import { Module } from '@nestjs/common' ;
import { ArticleService, AuthorService } from './article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import  { AuthorCredentialsEntity } from '../entities/authorCredentials.entity';
import { ArticleCredentialsEntity } from '../entities/articleCredentials.entity'; 
import { ArticleController, AuthorController } from './article.controller';

import { ARTICLE_REPOSITORY } from './article.repository.interface';
import { ArticleRepository } from './article.repository';

import { AUTHOR_REPOSITORY } from './article.repository.interface';
import { AuthorRepository } from './article.repository';

@Module({
    imports: [
      TypeOrmModule.forFeature([
        AuthorCredentialsEntity,
        ArticleCredentialsEntity
      ])
    ],
    controllers:[ArticleController, AuthorController],
    providers: [
        ArticleService,
        {
          provide: ARTICLE_REPOSITORY,
          useClass: ArticleRepository,
        },
        AuthorService,
        {
          provide: AUTHOR_REPOSITORY,
          useClass: AuthorRepository,
        }
      ],
      
    exports: [ArticleService, AuthorService]
})

export class ArticleModule {}
