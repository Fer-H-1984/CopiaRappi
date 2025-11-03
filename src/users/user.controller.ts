import { Controller, Get, Post, Body, Delete, Param, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './entities/dto/create-user.dto';
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
    // endpoints de prueba, probablemente se eliminen luego y se dejen sus servicios(los que no tienen Roles)
    @Get()
    @Public()
    findAll() {
        return this.usersService.findAll();
    }

    @Get('address')
    findAddress() {
        return this.usersService.findAddress();
    }

    @Get(':id')
    @Public()
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);
    }

    //deberia moverse a auth.controller.ts
    @Post('register')
    async create(@Body() body: CreateUserDto) {
        const user = await this.usersService.create(body)
        return user;
    }

    @Put(':id')
    @Roles(UserRole.CLIENT, UserRole.ADMIN, UserRole.DRIVER, UserRole.VENDOR) //solo usuarios con rol pueden actualizar
    update(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.usersService.update(+id, body);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN) //solo admin puede eliminar
    delete(@Param('id') id: string) {
        return this.usersService.delete(+id);
    }

    @Get(':id/orders')
    @Roles(UserRole.CLIENT, UserRole.DRIVER, UserRole.VENDOR)
    async getUserOrders(@Param('id') id: string) {
        const userId = Number(id);
        return this.ordersService.findByUserId(userId);
    }

    @Get(':nombre/search')
    @Roles(UserRole.CLIENT)
    async getVendorByName(@Param('nombre') nombre: string) {
        return this.vendorService.findByVendorName(nombre);
    }

    @Put(':userId/favorites/:vendorId')
    @Roles(UserRole.CLIENT)
    ToggleFavorite(@Param('userId') userId: number, @Param('vendorId') vendorId: number) {
        return this.usersService.toggleFavoriteVendor(userId, vendorId);
    }

}
