import { Controller, Get, Post, Body, Delete, Param, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './entities/dto/create-user.dto';
import { UpdateUserDto } from './entities/dto/update-user.dto';
import { OrdersService } from 'src/orders/orders.service';
import { VendorsService } from 'src/vendors/vendors.service';
import { LoginUserDTO } from './entities/dto/login-user.dto';
import { log } from 'console';



@Controller('user')
export class UserController {
    constructor(
        private readonly usersService: UsersService,
        private readonly ordersService: OrdersService, 
        private readonly vendorService: VendorsService
    ) {}

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get('address')
    findAddress() {
        return this.usersService.findAddress();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);
    }

    @Post('register')
    async create(@Body() body: CreateUserDto) {
        const user = await this.usersService.create(body)
        return user;
    }

    @Post('LogIn')
    async login(@Body() logInUserDTO: CreateUserDto ) {
        return this.usersService.logIn(logInUserDTO);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.usersService.update(+id, body);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.usersService.delete(+id);
    }

    @Get(':id/orders')
    async getUserOrders(@Param('id') id: string) {
        const userId = Number(id);
        return this.ordersService.findByUserId(userId);
    }

    @Get(':nombre/search')
    async getVendorByName(@Param('nombre') nombre: string) {
        return this.vendorService.findByVendorName(nombre);
    }

    @Put(':userId/favorites/:vendorId')
    ToggleFavorite(@Param('userId') userId: number, @Param('vendorId') vendorId: number) {
        return this.usersService.toggleFavoriteVendor(userId, vendorId);
    }

}
