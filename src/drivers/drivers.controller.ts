import { Controller, Body, Put, Param, Delete } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { UpdateDriverDto } from './entities/dto/update-driver.dto';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/entities/user/user.entity';


@Controller('drivers')
export class DriversController {
    constructor(private readonly driverService: DriversService) {}

    @Put(':id')
    @Roles(UserRole.DRIVER, UserRole.ADMIN)
    update(@Param('id') id:string, @Body() UpdateDriverDto: UpdateDriverDto) {
        return this.driverService.update(+id, UpdateDriverDto);
    }
       
    @Delete(':id')
    @Roles(UserRole.ADMIN)
    delete(@Param('id') id: string) {
        return this.driverService.delete(+id);
    }
}
