import { Controller, Get, Post, Body, Patch, Param, Delete, InternalServerErrorException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/entities/user/user.entity';
import { plainToInstance } from 'class-transformer';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { validateParameters } from 'src/shared/utils/parameters-validation';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @Roles(UserRole.CLIENT)
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  @Roles(UserRole.CLIENT, UserRole.VENDOR, UserRole.ADMIN)
  async findAll() {
    const payments = await this.paymentsService.findAll();
    return payments.map(p => plainToInstance(PaymentResponseDto, p, { excludeExtraneousValues: true }));
  }

  @Get(':id')
  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  async findOneDto(@Param('id') id: string) {
    if(!validateParameters(id)) throw new InternalServerErrorException('Parametros inválidos')
    const payment = await this.paymentsService.findOne(+id);
    return payment? plainToInstance(PaymentResponseDto, payment, { excludeExtraneousValues: true }) : 'No se ha encontrado el pago';
  }

  @Patch(':id')
  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    if(!validateParameters(id)) throw new InternalServerErrorException('Parametros inválidos')
    return this.paymentsService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    if(!validateParameters(id)) throw new InternalServerErrorException('Parametros inválidos')
    return this.paymentsService.delete(+id);
  }

  @Patch(':id/confirm')
  @Roles(UserRole.ADMIN) 
  async confirmPayment( @Param('id') id: number, @Body('success') success: boolean) {
    if(!validateParameters(id)) throw new InternalServerErrorException('Parametros inválidos')
    return this.paymentsService.confirm(+id, success);
  }
}
