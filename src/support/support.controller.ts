import { Controller, Get, Post, Body, Param, Request, Put } from '@nestjs/common';
import { SupportService } from './support.service';
import { CreateSupportDto } from './dto/create-support.dto';
import { UpdateSupportDto } from './dto/update-support.dto';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/entities/user/user.entity';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('contact')
  @Roles(UserRole.CLIENT, UserRole.DRIVER, UserRole.VENDOR)
  create(@Body() createSupportDto: CreateSupportDto, @Request() req) {
    createSupportDto.UserId = req.user.id
    return this.supportService.create(createSupportDto);
  }

  @Get('requests')
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.supportService.findAll();
  }

  @Get('my-requests/:id') //historial o registro de soporte
  @Roles(UserRole.CLIENT, UserRole.DRIVER, UserRole.VENDOR)
  findOne(@Param('id') id: string) {
    return this.supportService.findOne(+id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateSupportDto: UpdateSupportDto) {
    return this.supportService.update(+id, updateSupportDto);
  }
}
