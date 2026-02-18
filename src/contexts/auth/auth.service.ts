import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AUTH_REPOSITORY } from './auth.repository.interface';
import { IAuthRepository } from './auth.repository.interface';
import { UserCredentialsEntity} from '../entities/userCredentials.entity'
import * as bcrypt from 'bcrypt';
import { PlayerNotFound, UserAlreadyExists } from './errors/auth.errors';
import { RegisterDTO, LoginDTO, UpdateUserDTO } from './auth.types';
import { EVENT_BUS, EventBusPort } from 'src/core/events/event-bus.port';
import { UserRegisteredEvent } from './events/user-registered.event';
import { DEFAULT_USER_PERMISSIONS } from 'src/core/permissions/permissions.constants';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly authRepo: IAuthRepository,
    @Inject(EVENT_BUS) private readonly eventBus: EventBusPort 
  ) {}

  async register(dto: RegisterDTO): Promise<UserCredentialsEntity> {
    const existingUser = await this.authRepo.findCredentialByEmail(dto.email);

    if (existingUser) {
      throw new UserAlreadyExists();
    }
    
    const passwordHash = await bcrypt.hash(dto.password, 10);

    await this.eventBus.publish(UserRegisteredEvent.create({
      email: dto.email,
    }))

    // Créer l'utilisateur avec les permissions par défaut
    return this.authRepo.createUser({
      email: dto.email,
      passwordHash,
      permissions: DEFAULT_USER_PERMISSIONS,
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

  async getAllUsers(page = 1, pageSize = 10): Promise<{ data: UserCredentialsEntity[]; meta: { page: number; pageSize: number; total: number; totalPages: number } }> {
    const { items, total } = await this.authRepo.findAllUsersPaginated(page, pageSize);
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return {
      data: items,
      meta: {
        page,
        pageSize,
        total,
        totalPages,
      },
    };
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
        throw new UserAlreadyExists();
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

