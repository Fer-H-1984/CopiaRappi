import { Controller, Get, Post, Body, Delete, Param, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { ControllerInterface } from 'src/shared/interfaces/controller.interface';
import { CreateUserDto } from './entities/dto/create-user.dto';


@Controller('user')
export class UserController implements ControllerInterface {
    constructor(
        private readonly usersService: UsersService
    ) {}

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);
    }

    @Post()
    create(@Body() body: CreateUserDto) {
        return this.usersService.create(body);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() body: CreateUserDto) {
        return this.usersService.update(+id, body);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.usersService.delete(+id);
    }
}
