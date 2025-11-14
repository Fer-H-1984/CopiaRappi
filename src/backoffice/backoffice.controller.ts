import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  InternalServerErrorException,
} from '@nestjs/common';
import { DriversService } from '../drivers/drivers.service';
import { CreateDriverDto } from '../drivers/entities/dto/create-driver.dto';
import { UpdateDriverDto } from '../drivers/entities/dto/update-driver.dto';
import { Driver, DriverStatus } from '../drivers/entities/drivers/driver.entity';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/entities/user/user.entity';
import { FindDriverDto } from 'src/drivers/entities/dto/find-driver.dto';
import { PaginatedResult } from 'src/shared/interfaces/paginatedResult.type';
import { validateParameters } from 'src/shared/utils/parameters-validation';


@Controller('backoffice')
export class BackofficeController {
  
  constructor(
    private readonly driversService: DriversService,
  ) {}

  
  @Get('drivers')
  @Roles(UserRole.ADMIN)
  async getAllDrivers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: DriverStatus,
    @Query('isActive') isActive?: boolean,
  ) {
    if(!validateParameters(page, limit)) throw new InternalServerErrorException('Parametros inválidos')
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 10;

    const dto = new FindDriverDto;
    dto.isActive = isActive;
    dto.status = status

    return await this.driversService.findAll({page: pageNum, limit: limitNum}, dto);
  }

  @Get('drivers/:id')
  @Roles(UserRole.ADMIN)
  async getDriverById(
    @Param('id', ParseIntPipe) id: number,
  ) {
    if(!validateParameters(id)) throw new InternalServerErrorException('Parametros inválidos')
    const driver = await this.driversService.findOne(id);
    return driver? driver : 'No se ha encontrado el repartidor.'
  }

  
  @Post('drivers')
  @Roles(UserRole.ADMIN)
  async createDriver(
    @Body() createDriverDto: CreateDriverDto,
  ) {
    return await this.driversService.create(createDriverDto);
  }

  
  @Patch('drivers/:id')
  @Roles(UserRole.ADMIN)
  async updateDriver(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDriverDto: UpdateDriverDto,
  ) {
    if(!validateParameters(id)) throw new InternalServerErrorException('Parametros inválidos')
    return await this.driversService.update(id, updateDriverDto);
  }

  
  @Patch('drivers/:id/status')
  @Roles(UserRole.ADMIN)
  async updateDriverStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: DriverStatus,
  ) {
    if(!validateParameters(id)) throw new InternalServerErrorException('Parametros inválidos')
    return await this.driversService.updateStatus(id, status);
  }

  @Patch('drivers/:id/toggle-active')
  @Roles(UserRole.ADMIN)
  async toggleDriverActive(
    @Param('id', ParseIntPipe) id: string,
    @Body('isActive') isActive: boolean,
  ) {
    if(!validateParameters(id)) throw new InternalServerErrorException('Parametros inválidos')
    return await this.driversService.toggleActive(+id, isActive);
  }

 
  @Patch('drivers/:id/verify-documents')
  @Roles(UserRole.ADMIN)
  async verifyDriverDocuments(
    @Param('id', ParseIntPipe) id: number,
  ) {
    if(!validateParameters(id)) throw new InternalServerErrorException('Parametros inválidos')
    return await this.driversService.verifyDocuments(id);
  }

  @Get('drivers/:id/statistics')
  @Roles(UserRole.ADMIN)
  async getDriverStatistics(
    @Param('id', ParseIntPipe) id: number,
  ) {
    if(!validateParameters(id)) throw new InternalServerErrorException('Parametros inválidos')
    return await this.driversService.getStatistics(id);
  }

  @Delete('drivers/:id')
  @Roles(UserRole.ADMIN)
  async removeDriver(
  @Param('id', ParseIntPipe) id: number,
  ) {
    if(!validateParameters(id)) throw new InternalServerErrorException('Parametros inválidos')
    await this.driversService.softRemove(id);
  }


  @Get('drivers/:id/location')
  @Roles(UserRole.ADMIN)
  async getDriverLocation(
    @Param('id', ParseIntPipe) id: number,
  ) {
    if(!validateParameters(id)) throw new InternalServerErrorException('Parametros inválidos')
    const driver = await this.driversService.findOne(id);
    
    return {
      id: driver.id,
      currentLatitude: driver.currentLatitude,
      currentLongitude: driver.currentLongitude,
      lastLocationUpdate: driver.lastLocationUpdate,
      status: driver.status,
    };
  }

 
  @Get('drivers-map')
  @Roles(UserRole.ADMIN)
  async getDriversMap() {
    const drivers = await this.driversService.findAll({page: 1, limit: 100}) as PaginatedResult<Driver>;
    
    return drivers.data
      .filter(d => d.currentLatitude && d.currentLongitude)
      .map(driver => ({
        id: driver.id,
        latitude: driver.currentLatitude,
        longitude: driver.currentLongitude,
        status: driver.status,
        lastUpdate: driver.lastLocationUpdate,
      }));
  }
}
