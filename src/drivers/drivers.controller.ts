import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { Driver } from './entities/drivers/drivers';
import { CreateDriverDto } from './entities/dto/create-driver.dto';
import { UpdateDriverDto } from './entities/dto/update-driver.dto';


@Controller('drivers')
export class DriversController {
    constructor(private readonly driverService: DriversService) {}

    @Get()
    findAll(): Promise<Driver[]> {
        return this.driverService.findAll();
    }

   /*  @Post('demo')
    createDemo(): Promise<Driver> {
        return this.driverService.createDemo();
    } */

    @Post('register')
    create(@Body() createDriverDto: CreateDriverDto): Promise<Driver> {
        return this.driverService.create(createDriverDto);
    }

    @Put(':id')
    update(@Param('id') id:string, @Body() UpdateDriverDto: UpdateDriverDto) {
        return this.driverService.update(+id, UpdateDriverDto);
    }
       
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.driverService.delete(+id);
    }
}
