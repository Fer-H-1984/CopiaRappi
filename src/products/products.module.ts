import { forwardRef, Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/products/products.entity';
import { Category } from './entities/products/category.entity';
import { VendorsModule } from 'src/vendors/vendors.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category]), forwardRef(() => VendorsModule)],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [TypeOrmModule, ProductsService],
})
export class ProductsModule {}
