

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

async findCredentialById(id: number): Promise<UserCredentialsEntity | null> {
    return this.credentialRepository.findOne({
      where: { id },
    });
  }

  async findAllUsers(): Promise<UserCredentialsEntity[]> {
    return this.credentialRepository.find();
  }

  async updateUser(id: number, userData: Partial<UserCredentialsEntity>): Promise<UserCredentialsEntity> {
    await this.credentialRepository.update(id, userData);
    const updatedUser = await this.findCredentialById(id);
    if (!updatedUser) {
      throw new Error('User not found after update');
    }
    return updatedUser;
  }

async deleteUserById(id: number): Promise<boolean> {
  const result = await this.credentialRepository.delete({ id });

  return true;
}



  async checkRscCategoryExist(){}
  async createRscCategoryExist(){}
}
