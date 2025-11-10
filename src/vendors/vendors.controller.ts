import { Controller, Delete, Get, Patch, Post, Body, Query } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './entities/dto/create-vendor.dto';
import { UpdateVendorDto } from './entities/dto/update-vendor.dto';
import { Param } from '@nestjs/common';
import { Public } from 'src/auth/public.decorator';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/entities/user/user.entity';

@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Get()
  @Public()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    const options: any = {};
		if (page) options.page = Number(page);
		if (limit) options.limit = Number(limit);
    return this.vendorsService.findAll(Object.keys(options).length ? options : {});
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.vendorsService.findOne(+id);
  }

  @Post()
  @Public()
  create(@Body() createdto: CreateVendorDto) {
    return this.vendorsService.create(createdto);
  }
  
  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.VENDOR)
  update(@Param('id') id: string, @Body() dto: UpdateVendorDto) {
    return this.vendorsService.update(+id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.vendorsService.delete(+id);
  }



  @Get(':id/products')
@Public()
getVendorProducts(@Param('id') id: string) {
  return this.vendorsService.getProducts(+id);
}



@Get(':id/statistics')
@Public()
getVendorStatistics(@Param('id') id: string) {
  return this.vendorsService.getStatistics(+id);
}
}
