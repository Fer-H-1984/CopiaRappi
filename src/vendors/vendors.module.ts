import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorsController } from './vendors.controller';
import { VendorsService } from './vendors.service';
import { Vendor } from './entities/vendors/vendors.entity';
import { Product } from 'src/products/entities/products/products.entity'; // <-- importa Product

@Module({
  imports: [
    TypeOrmModule.forFeature([Vendor, Product]), // <-- agrega Product aquí
  ],
  controllers: [VendorsController],
  providers: [VendorsService],
  exports: [TypeOrmModule, VendorsService],
})
export class VendorsModule {}
