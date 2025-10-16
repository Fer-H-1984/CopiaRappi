import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceInterface } from 'src/shared/interfaces/service.interface';
import { Order } from './entities/orders/orders';
import { Repository } from 'typeorm';
import { CreateOrdersDto } from './entities/dto/create-orders.dto';
import { UpdateOrderDto } from './entities/dto/update-order.dto';

@Injectable()
export class OrdersService implements ServiceInterface {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>
    ) {}

    findAll(): Promise<Order[]> {
        return this.orderRepository.find({
            relations: ['user'] 
        });
    }

    create(body: CreateOrdersDto): Promise<Order> {
        this.orderRepository.create(body);
        return this.orderRepository.save(body);
    }

    update(id: number, body: UpdateOrderDto) {
        return this.orderRepository.update(id, body);
    }

    delete(id: number) {
        return this.orderRepository.delete(id);
    }
}
