import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestauranteModule } from './restaurante/restaurante.module';
import { RestaurantesController } from './restaurantes/restaurantes.controller';
import { RestaurantesService } from './restaurantes/restaurantes.service';
import { UsersModule } from './users/users.module';
import { UserController } from './user/user.controller';
import { VendorsModule } from './vendors/vendors.module';
import { DriversModule } from './drivers/drivers.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { BackofficeModule } from './backoffice/backoffice.module';

@Module({
  imports: [RestauranteModule, UsersModule, VendorsModule, DriversModule, OrdersModule, ProductsModule, BackofficeModule],
  controllers: [AppController, RestaurantesController, UserController],
  providers: [AppService, RestaurantesService],
})
export class AppModule {}
