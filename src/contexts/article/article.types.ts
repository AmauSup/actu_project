
import { IsEmail, IsString, IsUUID, IsOptional, IsUrl, MinLength } from 'class-validator';

// DTOs pour Author
export class CreateAuthorDTO {
  @IsString()
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  autor_first_name!: string;

  @IsString()
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  autor_last_name!: string;
}

export class UpdateAuthorDTO {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  autor_first_name?: string;

  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  autor_last_name?: string;
}

// DTOs pour Article
export class CreateArticleDTO {
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  name!: string;

  @IsString()
  @MinLength(10, { message: 'Description must be at least 10 characters long' })
  description!: string;

  @IsString()
  @MinLength(50, { message: 'Content must be at least 50 characters long' })
  content!: string;

  @IsString()
  categorie!: string;

  @IsUUID('4', { message: 'Author ID must be a valid UUID' })
  authorId!: string;

  @IsOptional()
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  imageUrl?: string;
}

export class UpdateArticleDTO {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(10, { message: 'Description must be at least 10 characters long' })
  description?: string;

  @IsOptional()
  @IsString()
  @MinLength(50, { message: 'Content must be at least 50 characters long' })
  content?: string;

  @IsOptional()
  @IsString()
  categorie?: string;

  @IsOptional()
  @IsUUID('4', { message: 'Author ID must be a valid UUID' })
  authorId?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  imageUrl?: string;
}
