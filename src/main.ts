import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefix all API route with /api/v1
  app.setGlobalPrefix('/api/v1');

  await app.listen(3001);
}
bootstrap();
