
import { IsArray, IsInt, IsString, IsUUID, IsOptional, IsUrl, MinLength } from 'class-validator';

// DTOs pour Category
export class CreateCategoryDTO {
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name!: string;

  @IsString()
  @MinLength(2, { message: 'Slug must be at least 2 characters long' })
  slug!: string;

  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Description must be at least 2 characters long' })
  description?: string;
}

export class UpdateCategoryDTO {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Slug must be at least 2 characters long' })
  slug?: string;

  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Description must be at least 2 characters long' })
  description?: string;
}

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

  @IsInt({ message: 'Author ID must be a valid integer' })
  authorId!: number;

  @IsOptional()
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  imageUrl?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  categoryIds?: number[];
}

// DTOs pour importer depuis NewsAPI
export class ImportArticlesDTO {
  @IsInt({ message: 'Count must be an integer' })
  count: number = 10;

  @IsOptional()
  @IsString()
  category?: string; // business, entertainment, general, health, science, sports, technology

  @IsOptional()
  @IsString()
  searchQuery?: string;
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
  @IsInt({ message: 'Author ID must be a valid integer' })
  authorId?: number;

  @IsOptional()
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  imageUrl?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  categoryIds?: number[];
}
