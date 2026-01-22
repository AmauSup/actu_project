

import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
  } from '@nestjs/common';
  import { LoginDTO } from './auth.types';
  import { AuthService } from './auth.service';
  
  @Controller('auth')
  export class AuthController {
    constructor(private readonly authService: AuthService) {}
  
    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() body: LoginDTO) {
      return this.authService.login(
        body.email,
        body.username,
        body.password,
      );
    }

    @Post('register')
create(@Body() userData: { email: string; password: string }) {
  return this.authService.create(userData);
}
  @Post('delete')
delete(@Body() userMail: { email: string}) {
  return this.authService.delete(userMail);
}

  }
  