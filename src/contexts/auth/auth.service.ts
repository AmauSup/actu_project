import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AUTH_REPOSITORY } from './auth.repository.interface';
import { IAuthRepository } from './auth.repository.interface';
import { UserCredentialsEntity} from '../entities/userCredentials.entity'
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly authRepo: IAuthRepository,
  ) {}

  async loginUserCase(){}
  private readonly user = {
    email: 'test@test.com',
    username: 'john',
    password: '123456',
  };

  login(email: string, username: string, password: string) {
    const isValid =
      email === this.user.email &&
      username === this.user.username &&
      password === this.user.password;

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      email,
      username,
      password
    };
  }

async create(userData: { email: string; password: string }): Promise<UserCredentialsEntity> {

  if (!userData.email || !userData.password) {
    throw new Error('Email and password are required');
  }
   const existingUser = await this.authRepo.findCredentialByEmail(userData.email);

  if (existingUser) {
    
    throw new BadRequestException('Email already exists');
  }
  const passwordHash = await bcrypt.hash(userData.password, 10);

  return this.authRepo.createUser({
    email: userData.email,
    passwordHash,
  });
}

async delete(userData: { email: string }): Promise<{ deleted: true }> {
    const email = userData?.email?.trim();

    if (!email) {
      throw new BadRequestException('Email is required');
    }

    const existingUser = await this.authRepo.findCredentialByEmail(email);
    if (!existingUser) {
      throw new BadRequestException('Email does not exist');
    }

    const deleted = await this.authRepo.deleteUserByEmail(email);
    if (!deleted) {
      throw new BadRequestException('User not found');
    }

    return { deleted: true };
  }

}
