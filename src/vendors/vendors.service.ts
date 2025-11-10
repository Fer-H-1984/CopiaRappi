import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from './entities/vendors/vendors.entity';
import { Product } from 'src/products/entities/products/products.entity';
import { CreateVendorDto } from './entities/dto/create-vendor.dto';
import { UpdateVendorDto } from './entities/dto/update-vendor.dto';
import { IServiceInterface } from 'src/shared/interfaces/service.interface';
import { PaginatedResult } from 'src/shared/interfaces/paginatedResult.type';
import { paginate } from 'src/shared/utils/pagination';

@Injectable()
export class VendorsService implements IServiceInterface<Vendor, CreateVendorDto, UpdateVendorDto> {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorsRepository: Repository<Vendor>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // Obtener todos los vendors con sus reviews y productos, con soporte de paginación
  findAll(options: { page?: number; limit?: number; [key: string]: any } = {}): Promise<Vendor[] | PaginatedResult<Vendor>> {
    const relations = ['reviews', 'products'];

    if (options.page && options.limit) {
      return paginate(this.vendorsRepository, options.page, options.limit, { relations });
    }

    return this.vendorsRepository.find({ relations });
  }

  // Obtener un vendor por id con sus productos y reviews
  async findOne(id: number): Promise<Vendor> {
    const vendor = await this.vendorsRepository.findOne({
      where: { id },
      relations: ['products', 'reviews'],
    });
    if (!vendor) {
      throw new NotFoundException(`Vendedor con id ${id} no encontrado`);
    }
    return vendor;
  }

  async create(dto: CreateVendorDto): Promise<Vendor> {
    try {
      const vendor = this.vendorsRepository.create(dto);
      return await this.vendorsRepository.save(vendor);
    } catch (error: unknown) {
      if (error instanceof Error) console.log(error.message);
      else console.log('Error desconocido', error);

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

  async getProducts(vendorId: number): Promise<Product[]> {
    return this.productRepository.find({ where: { vendor: { id: vendorId } } });
  }

  getStatistics(vendorId: number) {
    return {
      totalProducts: 10, // ejemplo fijo, luego lo calculas dinámicamente
      totalSales: 2500,  // ejemplo fijo
    };
  }
}
