import { Controller, Get, Query } from '@nestjs/common';
import { RestaurantesService } from './restaurantes.service';

@Controller('restaurantes')
export class RestaurantesController {
  constructor(private readonly restaurantesService: RestaurantesService) {}

  @Get('buscar')
  buscar(@Query('nombre') nombre: string, @Query('tipo') tipo: string) {
    return this.restaurantesService.buscar(nombre, tipo);
  }
}
