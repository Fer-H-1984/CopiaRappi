import { Controller, Body, Put, Param, Delete } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { UpdateDriverDto } from './entities/dto/update-driver.dto';


@Controller('drivers')
export class DriversController {
    constructor(private readonly driverService: DriversService) {}

    @Put(':id')
    update(@Param('id') id:string, @Body() UpdateDriverDto: UpdateDriverDto) {
        return this.driverService.update(+id, UpdateDriverDto);
    }
       
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.driverService.delete(+id);
    }
}
