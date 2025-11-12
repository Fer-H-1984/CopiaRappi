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
import { paginate } from 'src/shared/utils/pagination';
import { ProductRequestDto } from './entities/dto/product-request.dto';
import { plainToInstance } from 'class-transformer';
import { FilterProductDto } from './entities/dto/filter-product.dto';

@Injectable()
export class ProductsService implements IServiceInterface<Product, CreateProductDto, UpdateProductDto, ProductRequestDto> {
	constructor(
		@InjectRepository(Product)
		private readonly productRepository: Repository<Product>,
		@InjectRepository(Category)
		private readonly categoryRepository: Repository<Category>,
		private readonly vendorService: VendorsService
	) {}

	async create(data: CreateProductDto): Promise<Product> {
		const category = await this.categoryRepository.findOne({ where: { id: data.categoryId } });
		const vendor = await this.vendorService.findOne(data.vendorId);

		if (!category || !vendor) {
			throw new NotFoundException('El vendedor o la categoría del producto no existe');
		}

		const product = this.productRepository.create(data);
		product.category = category;
		product.vendor = vendor;

		return this.productRepository.save(product);
	}

	async findAll(
		options: { page?: number; limit?: number; [key: string]: any } = {},
		dtoFilter?: FilterProductDto
	): Promise<ProductRequestDto[] | PaginatedResult<ProductRequestDto>> {
		const relations = ['category'];
		const where: any = {};
		const page = options.page ? Number(options.page) : undefined;
		const limit = options.limit ? Number(options.limit) : undefined;

		if (dtoFilter?.isAvailable) where.isActive = dtoFilter.isAvailable;
		if (dtoFilter?.CategoryName) where.category = { name: dtoFilter.CategoryName };

		if (page && limit) {
			const paginated = await paginate(this.productRepository, page, limit, { relations }, where);
			return {
				...paginated,
				data: plainToInstance(ProductRequestDto, paginated.data, { excludeExtraneousValues: true }),
			};
		}

		const product = await this.productRepository.find({ relations });
		return plainToInstance(ProductRequestDto, product, { excludeExtraneousValues: true });
	}

	findOne(id: number): Promise<Product | null> {
		return this.productRepository.findOne({ where: { id }, relations: ['category', 'vendor'] });
	}

	async update(id: number, data: UpdateProductDto): Promise<Product> {
		const product = await this.productRepository.findOne({ where: { id }, relations: ['category', 'vendor'] });
		if (!product) throw new NotFoundException('Producto no encontrado');

		// Actualiza categoría si se envía categoryId
		if (data.categoryId) {
			const category = await this.categoryRepository.findOne({ where: { id: data.categoryId } });
			if (!category) throw new NotFoundException('Categoría no encontrada');
			product.category = category;
		}

		delete data.vendorId; // nunca permitimos cambiar el vendor
		Object.assign(product, data);

		return this.productRepository.save(product);
	}

	async delete(id: number): Promise<void> {
		await this.productRepository.delete(id);
	}
}
