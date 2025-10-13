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
      password: 'programacion4',
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
