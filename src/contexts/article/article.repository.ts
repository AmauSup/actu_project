

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleCredentialsEntity } from '../entities/articleCredentials.entity';
import { AuthorCredentialsEntity } from '../entities/authorCredentials.entity';
import { IArticleRepository } from './article.repository.interface';
import { Repository } from 'typeorm';

@Injectable()
export class ArticleRepository implements IArticleRepository {
  constructor(
    @InjectRepository(ArticleCredentialsEntity) private readonly articlecredentailRepository: Repository<ArticleCredentialsEntity>,
    
    ) {}

  

  async checkRscCategoryExist(){

  }
  async createRscCategoryExist(){

  }
}
export class AuthorRepository implements IArticleRepository {
  constructor(
    @InjectRepository(AuthorCredentialsEntity) private readonly authorcredentailRepository: Repository<AuthorCredentialsEntity>,
    ) {}
  
  
  }
