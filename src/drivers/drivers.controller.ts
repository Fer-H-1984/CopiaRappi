import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe } from '@nestjs/common';
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

  @Post('register')
  create(@Body() createDriverDto: CreateDriverDto): Promise<Driver> {
    return this.driverService.create(createDriverDto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateDriverDto) {
    return this.driverService.update(id, updateDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.driverService.delete(id);
  }
}
