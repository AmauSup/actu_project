

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './contexts/auth/auth.module';
import { ArticleModule } from './contexts/article/article.module';
import { ArticleService } from './contexts/article/article.service';
import { AuthService } from './contexts/auth/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'root',
        database: 'actu_project',
        synchronize: true,
        logging: false,
        autoLoadEntities: true,
        charset: 'utf8mb4',
        timezone: 'Z',
        migrations: [
          join(process.cwd(), 'dist/core/database/migrations/*.js'),
          join(process.cwd(), 'src/core/database/migrations/*.ts'),
        ],
      }),
    }),

    AuthModule,ArticleModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
