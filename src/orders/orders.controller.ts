import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrdersDto } from './entities/dto/create-orders.dto';
import { UpdateOrderDto } from './entities/dto/update-order.dto';
import { Request as ExpressRequest } from 'express';
import { UserRole } from 'src/users/entities/user/user.entity';
import { Roles } from 'src/auth/roles.decorator';

interface AuthRequest extends ExpressRequest {
  user: {
    id: number;
    email: string;
    role: string;
    vendorProfileId?: number;
  };
}

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Post()
  create(@Body() body: CreateOrdersDto) {
    return this.ordersService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdateOrderDto) {
    return this.ordersService.update(+id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.ordersService.delete(+id);
  }

  @Get('vendor/me')
  @Roles(UserRole.VENDOR)
  async getMyOrders(@Request() req: AuthRequest) {
    const vendorProfileId = req.user.id;

    if (!vendorProfileId) {
      throw new Error('Vendor profile not found in token');
    }

    return this.ordersService.getOrdersByVendor(vendorProfileId);
  }
}
