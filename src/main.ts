import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v2'); // Aplicar prefijo a todos los endpoints
  await app.listen(3000);
}
bootstrap();
