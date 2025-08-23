import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestauranteModule } from './restaurante/restaurante.module';
import { RestaurantesController } from './restaurantes/restaurantes.controller';
import { RestaurantesService } from './restaurantes/restaurantes.service';

@Module({
  imports: [RestauranteModule],
  controllers: [AppController, RestaurantesController],
  providers: [AppService, RestaurantesService],
})
export class AppModule {}
