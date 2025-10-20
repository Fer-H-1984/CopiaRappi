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
import { DeliveryModule } from './delivery/delivery.module';  // <-- importá el módulo Delivery

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'programacion4', // cambiar si es necesario
      //password: 'mapt123456',
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
    DeliveryModule,  // <-- agregalo acá en imports
  ],
  controllers: [AppController], 
  providers: [AppService],
})
export class AppModule {}
