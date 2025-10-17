import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/products/products';
import { CreateProductDto } from './entities/dto/create-product.dto';
import { UpdateProductDto } from './entities/dto/update-product.dto';
import { Vendor } from '../vendors/entities/vendors/vendors';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private repo: Repository<Product>,
    @InjectRepository(Vendor)
    private vendorRepo: Repository<Vendor>,
  ) {}

  async create(dto: CreateProductDto) {
    const product = this.repo.create({
      name: dto.name,
      price: dto.price,
      description: dto.description ?? '',
    });

    if (dto.vendorId) {
      const vendor = await this.vendorRepo.findOne({ where: { id: dto.vendorId } });
      if (vendor) product.vendor = vendor;
    }

    return this.repo.save(product);
  }

  findAll() {
    return this.repo.find({ relations: ['vendor'] });
  }

  async findOne(id: number) {
    const p = await this.repo.findOne({ where: { id }, relations: ['vendor'] });
    if (!p) throw new NotFoundException('Product not found');
    return p;
  }

  async update(id: number, dto: UpdateProductDto) {
    const product = await this.findOne(id);

    if (dto.name !== undefined) product.name = dto.name;
    if (dto.price !== undefined) product.price = dto.price;
    if (dto.description !== undefined) product.description = dto.description;

    if ((dto as any).vendorId !== undefined) {
      if ((dto as any).vendorId === null) product.vendor = null;
      else {
        const vendor = await this.vendorRepo.findOne({ where: { id: (dto as any).vendorId } });
        if (vendor) product.vendor = vendor;
      }
    }

    return this.repo.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    return this.repo.remove(product);
  }
}
