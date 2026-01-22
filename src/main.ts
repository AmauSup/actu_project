import { NestFactory } from '@nestjs/core';
import { AuthModule } from './contexts/auth/auth.module'

import { buildGlobalValidationPipe } from './core/http/validation/validation.pipe';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(buildGlobalValidationPipe())
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

