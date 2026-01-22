
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  // Utilisateur "défini"
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

    // Ce que tu veux renvoyer si c’est OK
    return {
      email,
      username,
      password
    };
  }
}
