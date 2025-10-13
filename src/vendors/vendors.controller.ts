import { Controller, Delete, Get, Patch, Post, Body, Param } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './entities/dto/create-vendor.dto';
import { UpdateVendorDto } from './entities/dto/update-vendor.dto';
import { UpdateVendorAvailabilityDto } from './entities/dto/update-vendor-availability.dto';

@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Get()
  findAll() {
    return this.vendorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vendorsService.findOne(+id);
  }

  @Post()
  create(@Body() createdto: CreateVendorDto) {
    return this.vendorsService.create(createdto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateVendorDto) {
    return this.vendorsService.update(+id, dto);
  }

  @Patch(':id/availability')
  updateAvailability(
    @Param('id') id: string,
    @Body() dto: UpdateVendorDto ,
  ) {
    if(dto.isActive !== undefined){
      const Dto = new UpdateVendorAvailabilityDto();
      Dto.available = dto.isActive;
      Dto.id = +id;
      return this.vendorsService.setAvailability(Dto);
    }

    throw new Error('isActive field is required');
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vendorsService.remove(+id);
  }
}
