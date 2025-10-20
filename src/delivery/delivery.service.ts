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
    return this.deliveryRepo.find();
  }

  async findOne(id: number): Promise<Delivery> {
    const delivery = await this.deliveryRepo.findOneBy({ id });
    if (!delivery) throw new NotFoundException(`Delivery with id ${id} not found`);
    return delivery;
  }

  async create(createDeliveryDto: CreateDeliveryDto): Promise<Delivery> {
  const { driverId, ...rest } = createDeliveryDto;

  const delivery = this.deliveryRepo.create(rest);

  if (driverId) {
    delivery.driver = { id: driverId } as any; // evita una consulta extra
  }

  return this.deliveryRepo.save(delivery);
}


  async update(id: number, updateDeliveryDto: UpdateDeliveryDto): Promise<Delivery> {
    const delivery = await this.findOne(id);
    Object.assign(delivery, updateDeliveryDto);
    return this.deliveryRepo.save(delivery);
  }

  async delete(id: number): Promise<void> {
    const result = await this.deliveryRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Delivery with id ${id} not found`);
    }
  }

  // ✅ NUEVO: Obtener entregas de un driver específico
  findByDriver(driverId: number): Promise<Delivery[]> {
    return this.deliveryRepo.find({
      where: { driver: { id: driverId } },
      relations: ['driver'],
    });
  }
}
