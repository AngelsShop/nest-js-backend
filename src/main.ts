import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.setGlobalPrefix('/api/v1');
  app.useGlobalPipes(new ValidationPipe());

  const swagger = new DocumentBuilder()
    .setTitle('API для AngelsShop')
    .setVersion('v1')
    .build();

  SwaggerModule.setup('api', app, () =>
    SwaggerModule.createDocument(app, swagger),
  );

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  const host = process.env.BACKEND_HOST
    ? String(process.env.BACKEND_HOST)
    : 'localhost';

  await app.listen({ port, host }, () =>
    console.log(`http://${host}:${port}/api`),
  );
}

bootstrap();
