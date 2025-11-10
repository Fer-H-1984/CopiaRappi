import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from './entities/vendors/vendors.entity';
import { CreateVendorDto } from './entities/dto/create-vendor.dto';
import { UpdateVendorDto } from './entities/dto/update-vendor.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { IServiceInterface } from 'src/shared/interfaces/service.interface';
import { PaginatedResult } from 'src/shared/interfaces/paginatedResult.type';
import { paginate } from 'src/shared/utils/pagination';

@Injectable()
export class VendorsService implements IServiceInterface <Vendor, CreateVendorDto, UpdateVendorDto> {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorsRepository: Repository<Vendor>,
  ) {}

  findAll(options: {page?: number; limit?: number; [key: string]: any} = {} ): Promise<Vendor[] | PaginatedResult<Vendor>> {

    const relations = ['product']

    if(options.page && options.limit) return paginate(this.vendorsRepository, options.page, options.limit, {relations})

    return this.vendorsRepository.find({relations});
  }

  async findOne(id: number): Promise<Vendor> {
    const vendor = await this.vendorsRepository.findOne({ where: { id }, relations: ['product', 'reviews'] });
    if (!vendor) {
      throw new NotFoundException(`Vendedor no encontrado`);
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
          console.log('Error desconocido', error);
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

  async delete(id: number): Promise<void> {
    const vendor = await this.findOne(id);
    await this.vendorsRepository.remove(vendor);
  }

  async findByVendorName(nombre: string): Promise<Vendor[]> {
    return this.vendorsRepository
      .createQueryBuilder('vendor')
      .where('vendor.shopName = :nombre', { nombre })
      .getMany();
  }
  
}
