import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');

  // 🔒 Global validation pipe with transformation and security settings
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,              // Strip unknown fields from DTO
      forbidNonWhitelisted: true,  // Throw error if unknown fields are sent
      transform: true,              // Automatically transform payloads to DTO instances
    }),
  );

  await app.listen(3000);
  
}
bootstrap();
