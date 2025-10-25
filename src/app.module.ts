import { Module } from '@nestjs/common';
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
import { UsersService } from './users/users.service';
import { DriversController } from './drivers/drivers.controller';
import { BackofficeController } from './backoffice/backoffice.controller';
import { VendorsController } from './vendors/vendors.controller';
import { DriversService } from './drivers/drivers.service';
import { BackofficeService } from './backoffice/backoffice.service';
import { VendorsService } from './vendors/vendors.service';
import { AuthModule } from './auth/auth.module';
import { UserController } from './users/user.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // carga .env y lo hace global. Necesario crear el ".env" en la raiz del proyecto
    AuthModule,
    UsersModule, VendorsModule, DriversModule, OrdersModule, ProductsModule, BackofficeModule, TypeOrmModule.forRoot({
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
  controllers: [AppController, UserController, DriversController, BackofficeController, VendorsController],
  providers: [AppService, UsersService, DriversService, BackofficeService, VendorsService],
})
export class AppModule {}
