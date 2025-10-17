import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from './entities/vendors/vendors';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private readonly repo: Repository<Vendor>,
  ) {}

  async setAvailability(id: string, available: boolean): Promise<Vendor> {
    const vendor = await this.repo.findOne({ where: { id: Number(id) } });
    if (!vendor) throw new NotFoundException('Vendor not found');
    vendor.isActive = available;
    return this.repo.save(vendor);
  }
}
