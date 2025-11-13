import { Controller, Body, Put, Post, Param, Delete, InternalServerErrorException } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { UpdateDriverDto } from './entities/dto/update-driver.dto';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/entities/user/user.entity';
import { validateParameters } from 'src/shared/utils/parameters-validation';
import { CreateSupportDto } from 'src/support/dto/create-support.dto';
import { SupportService } from 'src/support/support.service';


@Controller('drivers')
export class DriversController {
    constructor(private readonly driverService: DriversService, private readonly supportService: SupportService) {}

    @Post(':id/support')
    @Roles(UserRole.DRIVER)
    async sendSupportMessage(@Param('id') driverId: number, @Body() dto: CreateSupportDto,) {
        if(!validateParameters(driverId)) throw new InternalServerErrorException('Parametros inválidos')
        dto.UserId = driverId; 
        return this.supportService.create(dto);
    }

    @Put(':id')
    @Roles(UserRole.DRIVER, UserRole.ADMIN)
    update(@Param('id') id:string, @Body() UpdateDriverDto: UpdateDriverDto) {
        if(!validateParameters(id)) throw new InternalServerErrorException('Parametros inválidos')
        return this.driverService.update(+id, UpdateDriverDto);
    }
       
    @Delete(':id')
    @Roles(UserRole.ADMIN)
    delete(@Param('id') id: string) {
        if(!validateParameters(id)) throw new InternalServerErrorException('Parametros inválidos')
        return this.driverService.delete(+id);
    }
}
