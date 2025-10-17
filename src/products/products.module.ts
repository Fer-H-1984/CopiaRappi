import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './entities/products/products';
import { Vendor } from '../vendors/entities/vendors/vendors';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Vendor])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService], // opcional: si otros módulos necesitan usar ProductsService
})
export class ProductsModule {}
