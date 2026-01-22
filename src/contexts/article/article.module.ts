import { Module } from '@nestjs/common' ;
import { ArticleService } from './article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import  { AuthorCredentialsEntity } from '../entities/authorCredentials.entity';
import { ArticleCredentialsEntity } from '../entities/articleCredentials.entity'; 
import { AuthorService } from './article.service';

import { ARTICLE_REPOSITORY } from './article.repository.interface';
import { ArticleRepository } from './article.repository';

import { AUTHOR_REPOSITORY } from './article.repository.interface';
import { AuthorRepository } from './article.repository';

@Module({
    imports: [
      TypeOrmModule.forFeature([
        AuthorCredentialsEntity
      ]),
      TypeOrmModule.forFeature([
        ArticleCredentialsEntity
      ])
    ],
    controllers:[],
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
      
    exports: []
})

export class ArticleModule {}