import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { IServiceInterface } from 'src/shared/interfaces/service.interface';
import { Payment } from './entities/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class PaymentsService implements IServiceInterface<Payment, CreatePaymentDto, UpdatePaymentDto> {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>
  ){}

  create(createPaymentDto: CreatePaymentDto) : Promise<Payment> {
    const payment = this.paymentRepository.create(createPaymentDto);
    return this.paymentRepository.save(payment)
  }

  findAll() : Promise<Payment[]> {
    return this.paymentRepository.find();
  }

  findOne(id: number) : Promise<Payment | null> {
    return this.paymentRepository.findOne({where: {id: id}});
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) : Promise<any> {
    return this.paymentRepository.update(id, updatePaymentDto);
  }

  delete(id: number) : Promise<any> {
    return this.paymentRepository.delete(id);
  }
}
