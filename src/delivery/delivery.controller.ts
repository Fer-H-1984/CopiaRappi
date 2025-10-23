import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './entities/dto/create-delivery.dto';
import { UpdateDeliveryDto } from './entities/dto/update-delivery.dto';

@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get()
  findAll() {
    return this.deliveryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deliveryService.findOne(+id);
  }

  @Post()
  create(@Body() createDeliveryDto: CreateDeliveryDto) {
    return this.deliveryService.create(createDeliveryDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDeliveryDto: UpdateDeliveryDto) {
    return this.deliveryService.update(+id, updateDeliveryDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.deliveryService.delete(+id);
  }

  @Get('driver/:driverId')
  findByDriver(@Param('driverId') driverId: string) {
    return this.deliveryService.findByDriver(+driverId);
  }

  @Get('order/:orderId')
  findByOrder(@Param('orderId') orderId: string) {
    return this.deliveryService.findByOrder(+orderId);
  }
}
