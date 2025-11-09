import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrdersDto } from './entities/dto/create-orders.dto';
import { UpdateOrderDto } from './entities/dto/update-order.dto';
import { Public } from 'src/auth/public.decorator';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/entities/user/user.entity';

@Controller('orders')
export class OrdersController {
    constructor(
        private readonly ordersService: OrdersService
    ) {}

    @Get()
    @Public() //en produccion debe ser accesible con un rol
    findAll() {
        return this.ordersService.findAll();
    }

    @Post()
    @Roles(UserRole.CLIENT)
    create(@Body() body: CreateOrdersDto) {
        return this.ordersService.create(body);
    }

    @Put(':id')
    @Roles(UserRole.CLIENT, UserRole.ADMIN)
    update(@Param('id') id:string, @Body() body: UpdateOrderDto) {
        return this.ordersService.update(+id, body);
    }

    @Delete(':id')
    delete(@Param('id') id:string) {
        return this.ordersService.delete(+id);
    }

    @Get(':id/summary')
    @Roles(UserRole.CLIENT)
    async getOrderSummary(@Param('id') id: number) {
        return this.ordersService.getSummary(id);
    }

}
