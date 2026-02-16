

import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
  } from '@nestjs/common';
  import { RegisterDTO, LoginDTO, UpdateUserDTO } from './auth.types';
  import { AuthService } from './auth.service';
  
  @Controller('auth')
  export class AuthController {
    constructor(private readonly authService: AuthService) {}
  
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    register(@Body() body: RegisterDTO) {
      return this.authService.register(body);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() body: LoginDTO) {
      return this.authService.login(body);
    }

    @Get('users')
    @HttpCode(HttpStatus.OK)
    getAllUsers() {
      return this.authService.getAllUsers();
    }

    @Get('users/:id')
    @HttpCode(HttpStatus.OK)
    getUserById(@Param('id') id: number) {
      return this.authService.getUserById(id);
    }

    @Patch('users/:id')
    @HttpCode(HttpStatus.OK)
    updateUser(@Param('id') id: number, @Body() body: UpdateUserDTO) {
      return this.authService.updateUser(id, body);
    }

    @Delete('users/:id')
    @HttpCode(HttpStatus.OK)
    deleteUser(@Param('id') id: number) {
      return this.authService.deleteUser(id);
    }
  }