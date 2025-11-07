import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrdersDto } from './entities/dto/create-orders.dto';
import { UpdateOrderDto } from './entities/dto/update-order.dto';

@Controller('orders')
export class OrdersController {
    constructor(
        private readonly ordersService: OrdersService
    ) {}

    @Get()
    findAll() {
        return this.ordersService.findAll();
    }

    @Post()
    create(@Body() body: CreateOrdersDto) {
        return this.ordersService.create(body);
    }

    @Put(':id')
    update(@Param('id') id:string, @Body() body: UpdateOrderDto) {
        return this.ordersService.update(+id, body);
    }

    @Delete(':id')
    delete(@Param('id') id:string) {
        return this.ordersService.delete(+id);
    }

}
