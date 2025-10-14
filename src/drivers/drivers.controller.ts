import { Controller, Get, Post, Body } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { Driver } from './entities/drivers/drivers';
import { CreateDriverDto } from './entities/dto/create-driver.dto';


@Controller('drivers')
export class DriversController {
    constructor(private readonly driverService: DriversService) {}

    @Get()
    findAll(): Promise<Driver[]> {
        return this.driverService.findAll();
    }

    @Post('demo')
    createDemo(): Promise<Driver> {
        return this.driverService.createDemo();
    }

    @Post('register')
    create(@Body() createDriverDto: CreateDriverDto): Promise<Driver> {
        return this.driverService.register(createDriverDto);
    }
       
}
