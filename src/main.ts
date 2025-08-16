import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser(process.env.COOKIE_SECRET as string));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('SnipShell API')
    .setDescription('A command snippet management system API for storing, organizing, and retrieving shell commands with tags and notes.')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints for user registration, login, and token refresh')
    .addTag('commands', 'System commands management')
    .addTag('usercommands', 'User-specific command snippets with tags and notes')
    .addTag('users', 'User management operations')
    .addTag('tags', 'Tag management for organizing commands')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
