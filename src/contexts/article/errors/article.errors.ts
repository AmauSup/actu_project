import { DomainError } from "src/core/errors/domaine-error"

export class ArticleNotFound extends DomainError {
    constructor() {
        super({
            code: 'ARTICLE_NOT_FOUND',
            statusCode: 404,
            message: 'Article not found',
            fields: { id: ['The requested article does not exist'] }
        });
    }
}

export class AuthorNotFound extends DomainError {
    constructor() {
        super({
            code: 'AUTHOR_NOT_FOUND',
            statusCode: 404,
            message: 'Author not found',
            fields: { id: ['The requested author does not exist'] }
        });
    }
}

export class AuthorHasArticles extends DomainError {
    constructor() {
        super({
            code: 'AUTHOR_HAS_ARTICLES',
            statusCode: 400,
            message: 'Cannot delete author with existing articles',
            details: { reason: 'Please delete all associated articles first' }
        });
    }
}

export class ArticleAlreadyExists extends DomainError {
    constructor() {
        super({
            code: 'ARTICLE_ALREADY_EXISTS',
            statusCode: 400,
            message: 'Article already exists',
            fields: { name: ['An article with this name already exists'] }
        });
    }
}

export class AuthorAlreadyExists extends DomainError {
    constructor() {
        super({
            code: 'AUTHOR_ALREADY_EXISTS',
            statusCode: 400,
            message: 'Author already exists',
            fields: { author: ['An author with this name already exists'] }
        });
    }
}

export class CategoryNotFound extends DomainError {
    constructor(missingCategoryIds?: string[]) {
        super({
            code: 'CATEGORY_NOT_FOUND',
            statusCode: 404,
            message: 'One or more categories do not exist',
            fields: { categoryIds: [`Categories not found: ${missingCategoryIds?.join(', ') || 'unknown'}`] },
            details: { missingCategoryIds }
        });
    }
}

export class CategoryAlreadyExists extends DomainError {
    constructor() {
        super({
            code: 'CATEGORY_ALREADY_EXISTS',
            statusCode: 400,
            message: 'Category already exists',
            fields: { name: ['A category with this name or slug already exists'] }
        });
    }
}
