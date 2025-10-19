import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/orders/orders';
import { CreateOrdersDto } from './entities/dto/create-orders.dto';
import { UpdateOrderDto } from './entities/dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['user', 'driver'],
    });
  }

  async create(body: CreateOrdersDto): Promise<Order> {
    const order = this.orderRepository.create({
      status: body.status || 'pending',
      createdAt: body.createdAt,
      userId: body.userId,
      driverId: body.driverId,
      deliveredAt: body.deliveredAt,
    });
    return this.orderRepository.save(order);
  }

  async update(id: number, body: UpdateOrderDto): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'driver'],
    });
    if (!order) {
      throw new NotFoundException(`Order con id ${id} no encontrado`);
    }

    Object.assign(order, body);
    return this.orderRepository.save(order);
  }

  async delete(id: number): Promise<void> {
    const result = await this.orderRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Order con id ${id} no encontrado`);
    }
  }
}
