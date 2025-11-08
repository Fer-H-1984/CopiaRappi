import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { PaymentsMethodsService } from './payments-methods.service';
import { CreatePaymentsMethodDto } from './dto/create-payments-method.dto';
import { UpdatePaymentsMethodDto } from './dto/update-payments-method.dto';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/entities/user/user.entity';
import { Public } from 'src/auth/public.decorator';

@Controller('payments-methods')
export class PaymentsMethodsController {
  constructor(private readonly paymentsMethodsService: PaymentsMethodsService) {}

  @Post('add')
  @Roles(UserRole.ADMIN)
  create(@Body() createPaymentsMethodDto: CreatePaymentsMethodDto) {
    return this.paymentsMethodsService.create(createPaymentsMethodDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.paymentsMethodsService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.paymentsMethodsService.findOne(+id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updatePaymentsMethodDto: UpdatePaymentsMethodDto) {
    return this.paymentsMethodsService.update(+id, updatePaymentsMethodDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.paymentsMethodsService.delete(+id);
  }
}
