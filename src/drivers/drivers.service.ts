import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from './entities/drivers/drivers';
import { CreateDriverDto } from './entities/dto/create-driver.dto';
import { UpdateDriverDto } from './entities/dto/update-driver.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(Driver)
    private readonly driverRepo: Repository<Driver>,
  ) {}

  findAll(): Promise<Driver[]> {
    return this.driverRepo.find();
  }

  async create(createDriverDto: CreateDriverDto): Promise<Driver> {
    const { name, email, phone, password } = createDriverDto;

    const existing = await this.driverRepo.findOne({ where: { email: email.toLowerCase() } });
    if (existing) {
      throw new BadRequestException('El email ya está registrado');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newDriver = this.driverRepo.create({
      name,
      email: email.toLowerCase(),
      phone,
      passwordHash,
      status: 'inactive',
    });

    return this.driverRepo.save(newDriver);
  }

  async update(id: number, updateDto: UpdateDriverDto): Promise<Driver> {
    const driver = await this.driverRepo.findOne({ where: { id } });
    if (!driver) {
      throw new NotFoundException(`Driver con id ${id} no encontrado`);
    }

    if (updateDto.password) {
      updateDto['passwordHash'] = await bcrypt.hash(updateDto.password, 10);
      delete updateDto.password;
    }

    Object.assign(driver, updateDto);
    return this.driverRepo.save(driver);
  }

  async delete(id: number): Promise<void> {
    const result = await this.driverRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Driver con id ${id} no encontrado`);
    }
  }
}
