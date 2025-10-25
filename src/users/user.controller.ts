import { Controller, Get, Post, Body, Delete, Param, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './entities/dto/create-user.dto';
import { UpdateUserDto } from './entities/dto/update-user.dto';
import { OrdersService } from 'src/orders/orders.service';
import { VendorsService } from 'src/vendors/vendors.service';
import { UserRole } from './entities/user/user';
import { BackofficeService } from 'src/backoffice/backoffice.service';


@Controller('user')
export class UserController {
    constructor(
        private readonly usersService: UsersService,
        private readonly ordersService: OrdersService, 
        private readonly vendorService: VendorsService,
        private readonly backOfficeService: BackofficeService,
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
        //cambiar los servicios de cada usuario para que acepten estas propiedades en "create" o agregar dtos
        if(user.role === UserRole.VENDOR){
            await this.vendorService.create(user.vendorProfile)
        }
        else if(user.role === UserRole.DRIVER){ 
            await this.driverService.create(user.driverProfile)
        }
        else if (user.role === UserRole.ADMIN){
            await this.backOfficeService.create(user.backOfficeProfile)
        }

        return user;
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.usersService.update(+id, body);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.usersService.delete(+id);
    }
}
