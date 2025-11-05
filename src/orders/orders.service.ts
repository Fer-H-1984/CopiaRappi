import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IServiceInterface } from 'src/shared/interfaces/service.interface';
import { Order } from './entities/orders/orders.entity';
import { Repository } from 'typeorm';
import { CreateOrdersDto } from './entities/dto/create-orders.dto';
import { UpdateOrderDto } from './entities/dto/update-order.dto';

@Injectable()
export class OrdersService implements IServiceInterface<Order, CreateOrdersDto, UpdateOrderDto> {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['user'] 
    });
  }

  findOne(id: number): Promise<Order | null> {
    return this.orderRepository.findOne(
{
        where: { id: id },
            relations: ['user'],
        }) || Promise.reject('Order not found');
    }

    create(body: CreateOrdersDto): Promise<Order> {
        this.orderRepository.create(body);
        return this.orderRepository.save(body);
    }

    update(id: number, body: UpdateOrderDto) : Promise<any> {
        return this.orderRepository.update(id, body);
    }

    delete(id: number) : Promise<any> {
        return this.orderRepository.delete(id);
    }

    async findByUserId(userId: number): Promise<Order[]> {
        return this.orderRepository.find({
            where: { user: { id: userId } },
            relations: ['user'],
        });
    }

     async getOrdersByVendor(vendorId: number) {
    return await this.orderRepository.find({
      where: { vendor: { id: vendorId } },
      relations: ['vendor', 'user'], // si querés ver quién hizo el pedido
    });
  }
}
