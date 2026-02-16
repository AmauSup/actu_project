
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDTO {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password!: string;
}

export class LoginDTO {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email!: string;

  @IsString()
  password!: string;
}

export class UpdateUserDTO {
  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password?: string;
}
