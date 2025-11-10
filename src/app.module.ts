/*
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { VendorsModule } from './vendors/vendors.module';
import { DriversModule } from './drivers/drivers.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { BackofficeModule } from './backoffice/backoffice.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ReviewModule } from './review/review.module';
import { PaymentsMethodsModule } from './payments/payments-methods/payments-methods.module';
import { PaymentsModule } from './payments/payments.module';
import { SupportModule } from './support/support.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // carga .env y lo hace global. Necesario crear el ".env" en la raiz del proyecto
    AuthModule,
    UsersModule, VendorsModule, DriversModule, OrdersModule, ProductsModule, BackofficeModule, ReviewModule, SupportModule, TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',     
      password: 'programacion4',         //cambiar contraseña si es necesario
      database: 'copiaRappi',      
      autoLoadEntities: true,
      synchronize: true,    
      logging: true,       
    }), 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
*/
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VendorsModule } from './vendors/vendors.module';
import { DriversModule } from './drivers/drivers.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { BackofficeModule } from './backoffice/backoffice.module';
import { ReviewModule } from './review/review.module';
import { PaymentsModule } from './payments/payments/payments.module';
import { PaymentsMethodsModule } from './payments/payments-methods/payments-methods.module';

@Module({
  imports: [

    ConfigModule.forRoot({ 
      isGlobal: true, 
    }),
    
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'UmaPolo43',
      database: process.env.DB_DATABASE || 'copiaRappi',
      autoLoadEntities: true, 
      synchronize: process.env.NODE_ENV !== 'production' || true, 
      logging: process.env.NODE_ENV === 'development'|| true, 
    }),
    
    AuthModule,        
    UsersModule,       
    VendorsModule,     
    DriversModule,     
    OrdersModule,      
    ProductsModule,    
    BackofficeModule, 
    ReviewModule, 
    PaymentsModule, 
    forwardRef(()=> PaymentsMethodsModule) ,  
  ],
  controllers: [
    AppController, 
  ],
  providers: [
    AppService, 
  ],
})
export class AppModule {}