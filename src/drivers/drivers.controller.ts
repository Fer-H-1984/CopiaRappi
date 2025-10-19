import {Controller,Get,Post,Patch,Delete,Param,Body,ParseIntPipe,} from '@nestjs/common';
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

  @Post('demo')
  createDemo(): Promise<Driver> {
    return this.driverService.createDemo();
  }

  @Post('register')
  create(@Body() createDriverDto: CreateDriverDto): Promise<Driver> {
    return this.driverService.register(createDriverDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateDriverDto,
  ): Promise<Driver> {
    return this.driverService.update(id, updateDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.driverService.delete(id);
  }
}
