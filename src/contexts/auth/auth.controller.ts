

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
    Query,
    UseGuards,
  } from '@nestjs/common';
  import { RegisterDTO, LoginDTO, UpdateUserDTO } from './auth.types';
  import { AuthService } from './auth.service';
  import { ApiTokenGuard } from 'src/core/http/guards/api-token.guard';
  
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

    @UseGuards(ApiTokenGuard)
    @Get('users')
    @HttpCode(HttpStatus.OK)
    getAllUsers(@Query('page') page?: string, @Query('pageSize') pageSize?: string) {
      const pageNumber = Math.max(1, Number(page ?? 1));
      const pageSizeNumber = Math.max(1, Number(pageSize ?? 10));
      return this.authService.getAllUsers(pageNumber, pageSizeNumber);
    }

    @UseGuards(ApiTokenGuard)
    @Get('users/:id')
    @HttpCode(HttpStatus.OK)
    getUserById(@Param('id') id: string) {
      return this.authService.getUserById(Number(id));
    }

    @UseGuards(ApiTokenGuard)
    @Patch('users/:id')
    @HttpCode(HttpStatus.OK)
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDTO) {
      return this.authService.updateUser(Number(id), body);
    }

    @UseGuards(ApiTokenGuard)
    @Delete('users/:id')
    @HttpCode(HttpStatus.OK)
    deleteUser(@Param('id') id: string) {
      return this.authService.deleteUser(Number(id));
    }
  }