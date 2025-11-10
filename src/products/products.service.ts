import { Injectable, NotFoundException } from '@nestjs/common';
import { IServiceInterface } from 'src/shared/interfaces/service.interface';
import { Product } from './entities/products/products.entity';
import { CreateProductDto } from './entities/dto/create-product.dto';
import { UpdateProductDto } from './entities/dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginatedResult } from 'src/shared/interfaces/paginatedResult.type';
import { Category } from './entities/products/category.entity';
import { VendorsService } from 'src/vendors/vendors.service';

@Injectable()
export class ProductsService implements IServiceInterface<Product, CreateProductDto, UpdateProductDto> {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,

        private readonly vendorService: VendorsService,

    ){}

    async create(data: CreateProductDto): Promise<Product> {
        const category = await this.categoryRepository.findOne({where:{id: data.categoryId}})
        const vendor = await this.vendorService.findOne(data.vendorId)
        if(!category || !vendor){
            throw new NotFoundException('El vendedor o la categoria del producto no existe')
        }
        const product = this.productRepository.create(data)
        product.category = category
        product.vendor = vendor
        return this.productRepository.save(product)
    }

    async findAll(options: {page?: number; limit?: number; [key: string]: any} = {} ): Promise<Product[] | PaginatedResult<Product>> {
        const relations = ['category'];
        const page = options.page ? Number(options.page) : undefined;
        const limit = options.limit ? Number(options.limit) : undefined;

        if (page && limit) {
            const take = Math.max(1, Math.min(100, limit));
            const skip = (Math.max(1, page) - 1) * take;
            const [data, total] = await this.productRepository.findAndCount({ skip, take, relations });
            const pages = Math.ceil(total / take);
            return {
                data,
                meta: {
                    total,
                    page: Number(page),
                    limit: Number(take),
                    pages,
                },
            };
        }

        return this.productRepository.find({ relations });
    }

    findOne(id: number): Promise<Product | null> {
        return this.productRepository.findOne({ where:{ id: id }, relations: ['category', 'vendor']})
    }

    async update(id: number, data: UpdateProductDto): Promise<Product> {
        const existing = await this.productRepository.findOne({ where: { id } });
        if (!existing) throw new NotFoundException('Producto no encontrado');
        await this.productRepository.update(id, data);
        return this.findOne(id) as Promise<Product>;
    }

    delete(id: number): Promise<any> {
        return this.productRepository.delete(id)
    }
}
