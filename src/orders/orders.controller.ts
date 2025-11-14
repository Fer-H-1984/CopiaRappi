import { Body, Controller, Delete, Get, InternalServerErrorException, Param, Post, Put, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrdersDto } from './entities/dto/create-orders.dto';
import { UpdateOrderDto } from './entities/dto/update-order.dto';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/entities/user/user.entity';
import { validateParameters } from 'src/shared/utils/parameters-validation';

@Controller('orders')
export class OrdersController {
    constructor(
        private readonly ordersService: OrdersService
    ) {}

    @Get()
    @Roles(UserRole.ADMIN, UserRole.CLIENT, UserRole.VENDOR)
    findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
        if(!validateParameters(page, limit)) throw new InternalServerErrorException('Parametros inválidos')
        const options: any = {};
		if (page) options.page = Number(page);
		if (limit) options.limit = Number(limit);

        return this.ordersService.findAll(Object.keys(options).length ? options : {});
    }

    @Post('create')
    @Roles(UserRole.CLIENT)
    create(@Body() body: CreateOrdersDto) {
        return this.ordersService.create(body);
    }

    @Put(':id')
    @Roles(UserRole.CLIENT, UserRole.ADMIN)
    update(@Param('id') id: string, @Body() body: UpdateOrderDto) {
        if(!validateParameters(id)) throw new InternalServerErrorException('Parametros inválidos')
        return this.ordersService.update(+id, body);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        if(!validateParameters(id)) throw new InternalServerErrorException('Parametros inválidos')
        return this.ordersService.delete(+id);
    }

    @Get(':id/summary')
    @Roles(UserRole.CLIENT, UserRole.VENDOR)
    async getOrderSummary(@Param('id') id: number) {
        if(!validateParameters(id)) throw new InternalServerErrorException('Parametros inválidos')
        const order = await this.ordersService.getSummary(id);
        return order? order : 'No se ha encontrado el pedido.'
    }

}
