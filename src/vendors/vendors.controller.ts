import { Controller, Delete, Get, Patch, Post, Body } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './entities/dto/create-vendor.dto';
import { UpdateVendorDto } from './entities/dto/update-vendor.dto';
import { Param } from '@nestjs/common';

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
    console.log('BODY RECIBIDO:', createdto); // <-- Asegura que no esté vacío
    return this.vendorsService.create(createdto);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateVendorDto) {
    return this.vendorsService.update(+id, dto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vendorsService.delete(+id);
  }
}
