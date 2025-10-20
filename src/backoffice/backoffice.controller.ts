import { Body, Controller, Get, Post, Put, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { BackofficeService } from './backoffice.service';
import { CreateBackofficeDto } from './entities/dto/create-backoffice.dto';
import { UpdateBackofficeDto } from './entities/dto/update-backoffice.dto';

@Controller('backoffice')
export class BackofficeController {
  constructor(private readonly backofficeService: BackofficeService) {}

  @Get()
  findAll() {
    return this.backofficeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.backofficeService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateBackofficeDto) {
    return this.backofficeService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBackofficeDto) {
    return this.backofficeService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.backofficeService.delete(id);
  }
}
