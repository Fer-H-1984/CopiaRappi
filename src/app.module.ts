/*
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { VendorsModule } from './vendors/vendors.module';
import { DriversModule } from './drivers/drivers.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { BackofficeModule } from './backoffice/backoffice.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
/*       password: 'mapt123456', // cambiar si es necesario*/      
     /* password: 'programacion4',
      database: 'copiaRappi',
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),
    UsersModule,
    VendorsModule,
    DriversModule,
    OrdersModule,
    ProductsModule,
    BackofficeModule,
  ],
  controllers: [AppController], // solo controladores globales, si los hay
  providers: [AppService], // solo providers globales, si los hay
})
export class AppModule {}
*/
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Importar módulos
//import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VendorsModule } from './vendors/vendors.module';
import { DriversModule } from './drivers/drivers.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { BackofficeModule } from './backoffice/backoffice.module';

/**
 * 🏠 APP MODULE
 * 
 * Módulo raíz de la aplicación.
 * 
 * ⚠️ IMPORTANTE: Este módulo SOLO debe tener:
 * - imports: Módulos de la app
 * - AppController y AppService
 * 
 * ❌ NO debe tener controllers ni providers de otros módulos
 */
@Module({
  imports: [
    // ═══════════════════════════════════════════════════════════
    // 🌍 CONFIGURACIÓN GLOBAL
    // ═══════════════════════════════════════════════════════════
    
    ConfigModule.forRoot({ 
      isGlobal: true, // Hace que .env esté disponible en toda la app
      envFilePath: '.env', // Archivo de variables de entorno
    }),

    // ═══════════════════════════════════════════════════════════
    // 💾 CONEXIÓN A BASE DE DATOS
    // ═══════════════════════════════════════════════════════════
    
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'programacion4',
      database: process.env.DB_DATABASE || 'copiaRappi',
      autoLoadEntities: true, // Carga automáticamente todas las entidades
      synchronize: process.env.NODE_ENV !== 'production', // ⚠️ Solo en desarrollo
      logging: process.env.NODE_ENV === 'development', // Logs SQL solo en dev
    }),

    // ═══════════════════════════════════════════════════════════
    // 📦 MÓDULOS DE LA APLICACIÓN
    // ═══════════════════════════════════════════════════════════
    
    //AuthModule,        // Autenticación y JWT
    UsersModule,       // Gestión de usuarios
    VendorsModule,     // Gestión de vendors/restaurantes
    DriversModule,     // Gestión de drivers/repartidores
    OrdersModule,      // Gestión de pedidos
    ProductsModule,    // Gestión de productos
    BackofficeModule,  // ⭐ Panel administrativo (TAREAS 1-5)
    // ReviewModule,   // Sistema de reseñas (descomentar si existe)
  ],
  controllers: [
    AppController, // ⭐ SOLO el controller de App
  ],
  providers: [
    AppService, // ⭐ SOLO el service de App
  ],
})
export class AppModule {}