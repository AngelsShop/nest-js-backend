import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const swagger = new DocumentBuilder()
    .setTitle('API для AngelsShop')
    .setVersion('v1')
    .build();

  SwaggerModule.setup('api', app, () =>
    SwaggerModule.createDocument(app, swagger),
  );

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;

  console.log(process.env.DB_HOST);

  await app.listen({ port }, () => console.log(`http://localhost:${port}/api`));
}

bootstrap();
