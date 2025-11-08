import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de CORS
  app.enableCors({
  origin: ['http://localhost:5173'], // Permite solo este origen
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos permitidos
  allowedHeaders: 'Content-Type, Accept, Authorization', // 🔹 agregar Authorization
  credentials: true, // Permite enviar cookies si es necesario
});

  // Validación global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
