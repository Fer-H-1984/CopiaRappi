import { Controller, Get, Post, Body, Param, Request, Put, Query, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { SupportService } from './support.service';
import { CreateSupportDto } from './dto/create-support.dto';
import { UpdateSupportDto } from './dto/update-support.dto';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/entities/user/user.entity';
import { validateParameters } from 'src/shared/utils/parameters-validation';

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
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    const options: any = {};
    if(!validateParameters(page, limit)) throw new InternalServerErrorException('Parametros inválidos')
		if (page) options.page = Number(page);
		if (limit) options.limit = Number(limit);
    return this.supportService.findAll(Object.keys(options).length ? options : {});
  }

  @Get('my-requests/:id') 
  @Roles(UserRole.CLIENT, UserRole.DRIVER, UserRole.VENDOR)
  findOne(@Param('id') id: string, @Request() req) {
    if(!validateParameters(id)) throw new InternalServerErrorException('Parametros inválidos')
    const actualUser = req.user.id
    if (+id !== actualUser) throw new UnauthorizedException('No puedes obtener los mensajes de este usuario')
    return this.supportService.findOne(+id);
  }

  @Put(':id/response')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateSupportDto: UpdateSupportDto) {
    if(!validateParameters(id)) throw new InternalServerErrorException('Parametros inválidos')
    return this.supportService.update(+id, updateSupportDto);
  }
}
