import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Backoffice } from './entities/backoffice/backoffice';
import { CreateBackofficeDto } from './entities/dto/create-backoffice.dto';
import { UpdateBackofficeDto } from './entities/dto/update-backoffice.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BackofficeService {
  constructor(
    @InjectRepository(Backoffice)
    private readonly backofficeRepository: Repository<Backoffice>,
  ) {}

  async findAll(): Promise<Backoffice[]> {
    return this.backofficeRepository.find();
  }

  async findOne(id: number): Promise<Backoffice> {
    const user = await this.backofficeRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Backoffice con id ${id} no encontrado`);
    }
    return user;
  }

  async create(dto: CreateBackofficeDto): Promise<Backoffice> {
    try {
      const passwordHash = await bcrypt.hash(dto.password, 10);
      const user = this.backofficeRepository.create({
        username: dto.username,
        passwordHash,
        isActive: dto.isActive ?? true,
      });
      return await this.backofficeRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException('Error al crear el usuario Backoffice');
    }
  }

  async update(id: number, dto: UpdateBackofficeDto): Promise<Backoffice> {
    const user = await this.findOne(id);

    const updateData: Partial<Backoffice> = { ...dto };

    if (dto.password) {
      updateData.passwordHash = await bcrypt.hash(dto.password, 10);
      delete updateData['password'];
    }

    Object.assign(user, updateData);
    return this.backofficeRepository.save(user);
  }

  async delete(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.backofficeRepository.remove(user);
  }
}
