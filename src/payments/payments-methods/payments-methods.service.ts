import { Injectable } from '@nestjs/common';
import { CreatePaymentsMethodDto } from './dto/create-payments-method.dto';
import { UpdatePaymentsMethodDto } from './dto/update-payments-method.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentsMethod } from './entities/payments-method.entity';
import { Repository } from 'typeorm';
import { IServiceInterface } from 'src/shared/interfaces/service.interface';

@Injectable()
export class PaymentsMethodsService implements IServiceInterface<PaymentsMethod, CreatePaymentsMethodDto, UpdatePaymentsMethodDto>{
  constructor(
    @InjectRepository(PaymentsMethod)
    private readonly paymethodRepository: Repository<PaymentsMethod>,
  ){}

  create(createPaymentsMethodDto: CreatePaymentsMethodDto) : Promise<PaymentsMethod> {
    
    const method = this.paymethodRepository.create(createPaymentsMethodDto)
    return this.paymethodRepository.save(method);
  }

  findAll() {
    return this.paymethodRepository.find();
  }

  findOne(id: number) {
    return this.paymethodRepository.findOne({where:{id: id}});
  }

  update(id: number, updatePaymentsMethodDto: UpdatePaymentsMethodDto) : Promise<any> {
    return this.paymethodRepository.update(id, updatePaymentsMethodDto);
  }

  delete(id: number) : Promise<any>{
    return this.paymethodRepository.delete(id);
  }
}
