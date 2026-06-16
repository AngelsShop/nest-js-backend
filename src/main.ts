import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { default as cookieParser } from 'cookie-parser';
import { JwtOptionalAuthGuard } from '$app/auth/passport/jwt-optional-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix('/api/v1');
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.useGlobalGuards(new JwtOptionalAuthGuard());

  const swagger = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('API для AngelsShop')
    .setExternalDoc('angels-shop.ru', 'https://www.angels-shop.ru')
    .setVersion('v1')
    .build();

  SwaggerModule.setup(
    'api',
    app,
    () => SwaggerModule.createDocument(app, swagger),
    { swaggerOptions: { persistAuthorization: true } },
  );

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  const host = process.env.BACKEND_HOST
    ? String(process.env.BACKEND_HOST)
    : 'localhost';

  await app.listen(port, host, () => console.log(`http://${host}:${port}/api`));
}

bootstrap();
