import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from './entities/vendors/vendors.entity';
import { Product } from 'src/products/entities/products/products.entity';
import { CreateVendorDto } from './entities/dto/create-vendor.dto';
import { UpdateVendorDto } from './entities/dto/update-vendor.dto';
import { IServiceInterface } from 'src/shared/interfaces/service.interface';

@Injectable()
export class VendorsService implements IServiceInterface<Vendor, CreateVendorDto, UpdateVendorDto> {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorsRepository: Repository<Vendor>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>, // agregado para getProducts
  ) {}

  // Obtener todos los vendors con sus reviews y productos
  findAll(): Promise<Vendor[]> {
    return this.vendorsRepository.find({ relations: ['reviews', 'products'] });
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

  // Crear un nuevo vendor
  async create(dto: CreateVendorDto): Promise<Vendor> {
    try {
      const vendor = this.vendorsRepository.create(dto);
      return await this.vendorsRepository.save(vendor);
    } catch (error: unknown) {
      if (error instanceof Error) console.log(error.message);
      else console.log('Unknown error', error);

      throw new InternalServerErrorException(
        'Error al crear el vendor. Por favor, inténtalo de nuevo más tarde.',
      );
    }
  }

  // Actualizar un vendor
  async update(id: number, dto: UpdateVendorDto): Promise<Vendor> {
    const vendor = await this.findOne(id);
    Object.assign(vendor, dto);
    return this.vendorsRepository.save(vendor);
  }

  // Eliminar un vendor
  async delete(id: number): Promise<void> {
    const vendor = await this.findOne(id);
    await this.vendorsRepository.remove(vendor);
  }

  // Buscar vendors por nombre
  async findByVendorName(nombre: string): Promise<Vendor[]> {
    return this.vendorsRepository
      .createQueryBuilder('vendor')
      .where('vendor.shopName = :nombre', { nombre })
      .getMany();
  }

  // Obtener productos de un vendor
  async getProducts(vendorId: number): Promise<Product[]> {
    return this.productRepository.find({ where: { vendor: { id: vendorId } } });
  }

  // Obtener estadísticas de un vendor (puedes ampliarlo después)
  getStatistics(vendorId: number) {
    // Esto es un ejemplo, podrías sumar ventas, stock, etc.
    return {
      totalProducts: 10, // ejemplo fijo, luego lo calculas dinámicamente
      totalSales: 2500,  // ejemplo fijo
    };
  }
}
