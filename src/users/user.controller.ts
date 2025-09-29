import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';


@Controller('user')
export class UserController {
    constructor(
        private readonly usersService: UsersService
    ) {}

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Post()
    create(@Body() body: { nombre: string; email: string; password: string; isActive:boolean; address?: string }) {
    return this.usersService.create(body);
}

}
