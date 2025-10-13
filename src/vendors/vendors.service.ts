import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from './entities/vendors/vendors';
import { CreateVendorDto } from './entities/dto/create-vendor.dto';
import { UpdateVendorDto } from './entities/dto/update-vendor.dto';
import { InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorsRepository: Repository<Vendor>,
  ) {}

  findAll(): Promise<Vendor[]> {
    return this.vendorsRepository.find();
  }

  async findOne(id: number): Promise<Vendor> {
    const vendor = await this.vendorsRepository.findOneBy({ id });
    if (!vendor) {
      throw new NotFoundException(`Vendor con id ${id} no encontrado`);
    }
    return vendor;
  }

  async create(dto: CreateVendorDto): Promise<Vendor> {
    try {
      const vendor = this.vendorsRepository.create(dto);
      return await this.vendorsRepository.save(vendor);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log('Unknown error', error);
      }
      throw new InternalServerErrorException(
        'Error al crear el vendor. Por favor, inténtalo de nuevo más tarde.',
      );
    }
  }

  async update(id: number, dto: UpdateVendorDto): Promise<Vendor> {
    const vendor = await this.findOne(id);
    Object.assign(vendor, dto);
    return this.vendorsRepository.save(vendor);
  }

  async remove(id: number): Promise<void> {
    const vendor = await this.findOne(id);
    await this.vendorsRepository.remove(vendor);
  }
}
/*import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from './entities/vendors/vendors';
import { CreateVendorDto } from './entities/dto/create-vendor.dto';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorsRepository: Repository<Vendor>,
  ) {}

  async create(dto: CreateVendorDto): Promise<Vendor> {
    try {
      const vendor = this.vendorsRepository.create(dto);
      return await this.vendorsRepository.save(vendor);
    } catch (error: unknown) {
      // Si el error es una instancia de Error, mostramos su mensaje en consola
      if (error instanceof Error) {
        console.error('Error al crear vendor:', error.message);
      } else {
        console.error('Error desconocido al crear vendor:', error);
      }

      throw new InternalServerErrorException(
        'No se pudo crear el vendor. Revisá los datos enviados.',
      );
    }
  }
}
*/