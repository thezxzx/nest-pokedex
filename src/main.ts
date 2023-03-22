import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v2'); // Aplicar prefijo a todos los endpoints

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true, // Permite la transformación de los tipos (Dtos)
      transformOptions: {
        enableImplicitConversion: true, // Permite la transformación en los tipos esperados.
      },
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT);
  console.log(`App running on port ${process.env.PORT}`);
}
bootstrap();
