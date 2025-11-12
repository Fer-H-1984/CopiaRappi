import { forwardRef, Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/products/products.entity';
import { Category } from './entities/products/category.entity';
import { VendorsModule } from 'src/vendors/vendors.module';
import { ProductsCategoryService } from './product-category.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category]), forwardRef(() => VendorsModule)],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsCategoryService],
  exports: [TypeOrmModule, ProductsService, ProductsCategoryService],
})
export class ProductsModule {}
