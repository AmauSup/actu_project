import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AUTH_REPOSITORY } from './auth.repository.interface';
import { IAuthRepository } from './auth.repository.interface';
import { UserCredentialsEntity} from '../entities/userCredentials.entity'
import * as bcrypt from 'bcrypt';
import { DomainError } from 'src/core/errors/domaine-error';
import { PlayerNotFound } from './errors/auth.errors';
import { RegisterDTO, LoginDTO, UpdateUserDTO } from './auth.types';
import { EVENT_BUS, EventBusPort } from 'src/core/events/event-bus.port';
import { UserRegisteredEvent } from './events/user-registered.event';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly authRepo: IAuthRepository,
    @Inject(EVENT_BUS) private readonly eventBus: EventBusPort 
  ) {}

  async register(dto: RegisterDTO): Promise<UserCredentialsEntity> {
    const existingUser = await this.authRepo.findCredentialByEmail(dto.email);

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }
    
    const passwordHash = await bcrypt.hash(dto.password, 10);

    await this.eventBus.publish(UserRegisteredEvent.create({
      email: dto.email,
    }))

    return this.authRepo.createUser({
      email: dto.email,
      passwordHash,
    });
  }

  async login(dto: LoginDTO): Promise<{ user: UserCredentialsEntity }> {
    const user = await this.authRepo.findCredentialByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return { user };
  }

  async getAllUsers(): Promise<UserCredentialsEntity[]> {
    return this.authRepo.findAllUsers();
  }

  async getUserById(id: number): Promise<UserCredentialsEntity> {
    const user = await this.authRepo.findCredentialById(id);

    if (!user) {
      throw new PlayerNotFound({ fields: { id: ['User not found'] } });
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<UserCredentialsEntity> {
    const user = await this.authRepo.findCredentialByEmail(email);

    if (!user) {
      throw new PlayerNotFound({ fields: { email: ['User not found'] } });
    }

    return user;
  }

  async updateUser(id: number, dto: UpdateUserDTO): Promise<UserCredentialsEntity> {
    const user = await this.authRepo.findCredentialById(id);

    if (!user) {
      throw new PlayerNotFound({ fields: { id: ['User not found'] } });
    }

    const updateData: Partial<UserCredentialsEntity> = {};

    if (dto.email) {
      const existingUser = await this.authRepo.findCredentialByEmail(dto.email);
      if (existingUser && existingUser.id !== user.id) {
        throw new BadRequestException('Email already exists');
      }
      updateData.email = dto.email;
    }

    if (dto.password) {
      updateData.passwordHash = await bcrypt.hash(dto.password, 10);
    }

    return this.authRepo.updateUser(user.id, updateData);
  }

  async deleteUser(id: number): Promise<{ deleted: true }> {
    const user = await this.authRepo.findCredentialById(id);
    
    if (!user) {
      throw new PlayerNotFound({ fields: { id: ['User not found'] } });
    }

    const deleted = await this.authRepo.deleteUserById(id);
    if (!deleted) {
      throw new BadRequestException('Failed to delete user');
    }

    return { deleted: true };
  }
}

