import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { IServiceInterface } from 'src/shared/interfaces/service.interface';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentsMethodsService } from '../payments-methods/payments-methods.service';
import { OrdersService } from 'src/orders/orders.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PaymentsService implements IServiceInterface<Payment, CreatePaymentDto, UpdatePaymentDto> {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    
    private readonly paymethodService: PaymentsMethodsService,
    private readonly orderService: OrdersService,
    private readonly usersService: UsersService
  ){}

  async create(createPaymentDto: CreatePaymentDto) : Promise<Payment> {

    const order = await this.orderService.findOne(createPaymentDto.orderId);
    const method = await this.paymethodService.findOne(createPaymentDto.methodId)
    const user = await this.usersService.findOne(createPaymentDto.userId)

    if(!order) throw new NotFoundException('Orden no encontrada')
    if(!method || method.isActive === false) throw new NotFoundException('Método de pago invalido. Por favor elija otro')
    if(!user || user.isActive === false) throw new NotFoundException('Usuario no disponible')

    const transactionId = `SIM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
 
    const payment = this.paymentRepository.create({
      order: order,
      method: method, 
      transactionId: transactionId,
      status: method.isActive ? PaymentStatus.COMPLETED : PaymentStatus.PENDING,
      createdAt: new Date,
      user: user,
      amount: createPaymentDto.amount
    });
    return this.paymentRepository.save(payment)
  }

  async confirm(id: number, success: boolean): Promise<Payment> {
    const payment = await this.paymentRepository.findOneBy({ id });
    if (!payment) throw new NotFoundException('Pago no encontrado');

    payment.status = success ? PaymentStatus.COMPLETED : PaymentStatus.FAILED;
    return this.paymentRepository.save(payment);
  }


  async findAll(): Promise<Payment[]> {
    const payments = await this.paymentRepository.find({ relations: ['order', 'method', 'user'] });
    return payments.map(p => ({ ...p, amount: typeof p.amount === 'string' ? parseFloat(p.amount as any) : p.amount } as Payment));
  }

  async findOne(id: number): Promise<Payment | null> {
    const payment = await this.paymentRepository.findOne({ where: { id }, relations: ['order', 'method', 'user'] });
    if (!payment) return null;
    if (typeof payment.amount === 'string') payment.amount = parseFloat(payment.amount as any) as any;
    return payment;
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) : Promise<any> {

    if (!updatePaymentDto.methodId) {
      throw new NotFoundException('Método no especificado');
    }

    const method = await this.paymethodService.findOne(updatePaymentDto.methodId);
    if (!method) {
      throw new NotFoundException('Método no válido');
    }

    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['method'],
    });

    if (!payment) {
      throw new NotFoundException('Pago no encontrado');
    }

    Object.assign(payment, updatePaymentDto);

    return await this.paymentRepository.save(payment);
  }

  delete(id: number) : Promise<any> {
    return this.paymentRepository.delete(id);
  }
}
