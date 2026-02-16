import { Module } from '@nestjs/common' ;
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCredentialsEntity } from '../entities/userCredentials.entity';

import { AUTH_REPOSITORY } from './auth.repository.interface';
import { AuthRepository } from './auth.repository';
import { SendUserRegisteredHandler } from './handlers/send-user-registered.handler';


@Module({
    imports: [
      TypeOrmModule.forFeature([
        UserCredentialsEntity
      ])
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        SendUserRegisteredHandler,
        {
          provide: AUTH_REPOSITORY,
          useClass: AuthRepository,
        },
      ],
      
    exports: [AuthService]
})

export class AuthModule {}