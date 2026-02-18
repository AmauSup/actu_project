import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiTokenGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const tokenFromHeader = request.headers?.authorization?.replace(/^Bearer\s+/i, '');
    const tokenFromApiKey = request.headers?.['x-api-key'];
    const expectedToken = this.config.get<string>('API_TOKEN');

    if (!expectedToken) {
      throw new UnauthorizedException('API_TOKEN is not configured');
    }

    const providedToken = tokenFromHeader || tokenFromApiKey;

    if (!providedToken || providedToken !== expectedToken) {
      throw new UnauthorizedException('Invalid API token');
    }

    return true;
  }
}
