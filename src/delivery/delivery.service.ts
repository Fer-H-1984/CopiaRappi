import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Delivery } from './entities/delivery/delivery';
import { CreateDeliveryDto } from './entities/dto/create-delivery.dto';
import { UpdateDeliveryDto } from './entities/dto/update-delivery.dto';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Delivery)
    private readonly deliveryRepo: Repository<Delivery>,
  ) {}

  findAll(): Promise<Delivery[]> {
    return this.deliveryRepo.find({ relations: ['driver', 'order'] });
  }

  async findOne(id: number): Promise<Delivery> {
    const delivery = await this.deliveryRepo.findOne({
      where: { id },
      relations: ['driver', 'order'],
    });
    if (!delivery) throw new NotFoundException(`Delivery with id ${id} not found`);
    return delivery;
  }

  async create(createDeliveryDto: CreateDeliveryDto): Promise<Delivery> {
    const { driverId, orderId, ...rest } = createDeliveryDto;

    if (!orderId) {
      throw new BadRequestException('orderId es obligatorio');
    }

    const delivery = this.deliveryRepo.create(rest);

    if (driverId) {
      delivery.driver = { id: driverId } as any;
    }

    delivery.order = { id: orderId } as any;

    return this.deliveryRepo.save(delivery);
  }

  async update(id: number, updateDeliveryDto: UpdateDeliveryDto): Promise<Delivery> {
    const delivery = await this.findOne(id);
    Object.assign(delivery, updateDeliveryDto);

    // Si viene orderId o driverId, actualizar las relaciones
    if (updateDeliveryDto.driverId !== undefined) {
      delivery.driver = updateDeliveryDto.driverId ? { id: updateDeliveryDto.driverId } as any : null;
    }
    if (updateDeliveryDto.orderId !== undefined) {
      delivery.order = updateDeliveryDto.orderId ? { id: updateDeliveryDto.orderId } as any : null;
    }

    return this.deliveryRepo.save(delivery);
  }

  async delete(id: number): Promise<void> {
    const result = await this.deliveryRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Delivery with id ${id} not found`);
    }
  }

  findByDriver(driverId: number): Promise<Delivery[]> {
    return this.deliveryRepo.find({
      where: { driver: { id: driverId } },
      relations: ['driver', 'order'],
    });
  }

  findByOrder(orderId: number): Promise<Delivery | null> {
  return this.deliveryRepo.findOne({
      where: { order: { id: orderId } },
      relations: ['driver', 'order'],
    });
  }

}
