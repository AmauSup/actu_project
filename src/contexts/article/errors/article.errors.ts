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
