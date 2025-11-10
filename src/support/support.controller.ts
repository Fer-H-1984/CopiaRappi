import { Controller, Get, Post, Body, Param, Request, Put, Query } from '@nestjs/common';
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
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    const options: any = {};
		if (page) options.page = Number(page);
		if (limit) options.limit = Number(limit);
    return this.supportService.findAll(Object.keys(options).length ? options : {});
  }

  @Get('my-requests/:id') 
  @Roles(UserRole.CLIENT, UserRole.DRIVER, UserRole.VENDOR)
  findOne(@Param('id') id: string) {
    return this.supportService.findOne(+id);
  }

  @Put(':id/response')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateSupportDto: UpdateSupportDto) {
    return this.supportService.update(+id, updateSupportDto);
  }
}
