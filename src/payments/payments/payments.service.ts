import { forwardRef, Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { IServiceInterface } from 'src/shared/interfaces/service.interface';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentsMethodsService } from '../payments-methods/payments-methods.service';
import { OrdersService } from 'src/orders/orders.service';
import { UsersService } from 'src/users/users.service';
import { OrderStatus, Order } from 'src/orders/entities/orders/orders.entity';
import { UpdateOrderDto } from 'src/orders/entities/dto/update-order.dto';

@Injectable()
export class PaymentsService implements IServiceInterface<Payment, CreatePaymentDto, UpdatePaymentDto> {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    
    private readonly paymethodService: PaymentsMethodsService,
    @Inject(forwardRef(() => OrdersService))
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
      OrderId: order.id,
      order: {id: order.id} as Order,
      method: method, 
      transactionId: transactionId,
      status: method.isActive ? PaymentStatus.COMPLETED : PaymentStatus.PENDING,
      createdAt: new Date,
      user: user,
      amount: createPaymentDto.amount
    });
    return this.paymentRepository.save(payment)
  }

  async confirm(id: number, success: boolean) {
    const payment = await this.paymentRepository.findOne({where:{ id }, relations:['order', 'user']});
    if (!payment) throw new NotFoundException('Pago no encontrado');

    payment.status = success ? PaymentStatus.COMPLETED : PaymentStatus.FAILED;
    await this.paymentRepository.save(payment);

    console.log(success + " " + payment.order)
    if (success && payment.order) {
      payment.order.status = OrderStatus.COMPLETED;
      let updateOrder = new UpdateOrderDto
      updateOrder.status = payment.order.status
      updateOrder.trackingNumber = generateTrackingNumber(payment.order.id)
      await this.orderService.update(payment.order.id, updateOrder);
    }

    return {
      message: success
        ? 'Pago confirmado y pedido procesado con éxito.'
        : 'El pago ha fallado y el pedido fue cancelado.',
      paymentStatus: payment.status,
      orderStatus: payment.order?.status,
      order: payment.order,
      trackingNumber: payment.order.trackingNumber ?? null,
      amount: payment.amount,
      user: payment.user?.email,
     };
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
function generateTrackingNumber(orderId: number): string {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `TRK-${orderId}-${Date.now()}-${random}`;
}
