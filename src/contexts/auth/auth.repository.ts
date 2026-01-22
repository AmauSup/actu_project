

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCredentialsEntity } from '../entities/userCredentials.entity';

import { IAuthRepository } from './auth.repository.interface';
import { Repository } from 'typeorm';
@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(
    @InjectRepository(UserCredentialsEntity) private readonly credentialRepository: Repository<UserCredentialsEntity>,
  ) {}
  

  async createUser(userData: Partial<UserCredentialsEntity>): Promise<UserCredentialsEntity> {
    const user = this.credentialRepository.create(userData);
    return this.credentialRepository.save(user);
  }

async findCredentialByEmail(
    email: string,
  ): Promise<UserCredentialsEntity | null> {
    return this.credentialRepository.findOne({
      where: { email },
    });
  }

async deleteUserByEmail(email: string): Promise<boolean> {
  const result = await this.credentialRepository.delete({ email });

  return true;
}



  async checkRscCategoryExist(){}
  async createRscCategoryExist(){}
}
