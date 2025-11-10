import { Controller, Get, Body, Delete, Param, Put, Request, ForbiddenException, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './entities/dto/update-user.dto';
import { OrdersService } from 'src/orders/orders.service';
import { VendorsService } from 'src/vendors/vendors.service';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from './entities/user/user.entity';
import { Public } from 'src/auth/public.decorator';

@Controller('user')
export class UserController {
    constructor(
        private readonly usersService: UsersService,
        private readonly ordersService: OrdersService, 
        private readonly vendorService: VendorsService
    ) {}

    @Get()
    @Roles(UserRole.ADMIN)
    findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
        const options: any = {};
		if (page) options.page = Number(page);
		if (limit) options.limit = Number(limit);
        return this.usersService.findAll(Object.keys(options).length ? options : {});
    }

    @Get('address')
    @Public()
    findAddress() {
        return this.usersService.findAddress();
    }

    @Get(':id')
    @Roles(UserRole.ADMIN)
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);
    }

    @Put(':id')
    @Roles(UserRole.CLIENT, UserRole.ADMIN, UserRole.DRIVER, UserRole.VENDOR) 
    update(@Param('id') id: string, @Body() body: UpdateUserDto, @Request() req) {
        const userId = req.user.id;
        if (userId !== +id){
            throw new ForbiddenException('No puedes modificar este usuario')
        }
        return this.usersService.update(+id, body);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN) 
    delete(@Param('id') id: string) {
        return this.usersService.delete(+id);
    }

    @Get(':id/orders')
    @Roles(UserRole.CLIENT, UserRole.DRIVER, UserRole.VENDOR)
    async getUserOrders(@Param('id') id: string, @Request() req) {
        const userId = req.user.id
        if (userId !== +id){
            throw new ForbiddenException('No puedes obtener las ordenes de este usuario')
        }
        return this.ordersService.findByUserId(+id);
    }

    @Get(':nombre/search')
    @Roles(UserRole.CLIENT)
    async getVendorByName(@Param('nombre') nombre: string) {
        return this.vendorService.findByVendorName(nombre);
    }

    @Put(':userId/favorites/:vendorId')
    @Roles(UserRole.CLIENT)
    ToggleFavorite(@Param('userId') id: number, @Param('vendorId') vendorId: number, @Request() req) {
        const userId = req.user.id;
        if (userId !== +id){
            throw new ForbiddenException('No puedes modificar este usuario')
        }
        return this.usersService.toggleFavoriteVendor(id, vendorId);
    }
}
