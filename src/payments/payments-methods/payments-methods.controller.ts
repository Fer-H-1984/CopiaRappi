import { Controller, Get, Post, Body, Param, Delete, Put, InternalServerErrorException } from '@nestjs/common';
import { PaymentsMethodsService } from './payments-methods.service';
import { CreatePaymentsMethodDto } from './dto/create-payments-method.dto';
import { UpdatePaymentsMethodDto } from './dto/update-payments-method.dto';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/entities/user/user.entity';
import { Public } from 'src/auth/public.decorator';
import { validateParameters } from 'src/shared/utils/parameters-validation';

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
  async findOne(@Param('id') id: string) {
    if(!validateParameters(id)) throw new InternalServerErrorException('Parametros inválidos')
    const paymethod = await this.paymentsMethodsService.findOne(+id);
    return paymethod? paymethod : 'No existe el método de pago.'
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updatePaymentsMethodDto: UpdatePaymentsMethodDto) {
   
    if(!validateParameters(id)) throw new InternalServerErrorException('Parametros inválidos')
    return this.paymentsMethodsService.update(+id, updatePaymentsMethodDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    if(!validateParameters(id)) throw new InternalServerErrorException('Parametros inválidos')
    return this.paymentsMethodsService.delete(+id);
  }
}
