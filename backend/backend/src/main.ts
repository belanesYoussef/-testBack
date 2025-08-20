import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties not in DTO
      forbidNonWhitelisted: true, // throws if extra fields are sent
      transform: true, // auto transform payloads to DTO classes
    }),
  );
  app.enableCors({
    origin: 'http://localhost:5173', // allow your frontend
    credentials: true, // if you send cookies
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
