import { Controller, Get, Post, Body, Param, Patch, Delete, Request, Query, InternalServerErrorException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './entities/dto/create-product.dto';
import { UpdateProductDto } from './entities/dto/update-product.dto';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/entities/user/user.entity';
import { Public } from 'src/auth/public.decorator';
import { FilterProductDto } from './entities/dto/filter-product.dto';
import { ProductsCategoryService } from './product-category.service';
import { CreateCategoryDto } from './entities/dto/create-category.dto';
import { UpdateCategoryDto } from './entities/dto/update-category.dto';
import { validateParameters } from 'src/shared/utils/parameters-validation';


@Controller('products')
export class ProductsController {
	constructor(private readonly productsService: ProductsService, private readonly productsCategoryService: ProductsCategoryService,) {}

	@Get()
	@Public()
	findAll(@Query('page') page?: string, @Query('limit') limit?: string, @Query('isActive') isActive?: boolean,
	@Query('category') category?: number) {
		if(!validateParameters(page, limit, category)) throw new InternalServerErrorException('Parametros inválidos')
		const options: any = {};
		if (page) options.page = Number(page);
		if (limit) options.limit = Number(limit);
		const dtoFilter = new FilterProductDto
		dtoFilter.isAvailable = isActive;
		dtoFilter.categoryId = category;
		
		return this.productsService.findAll(Object.keys(options).length ? options : {}, dtoFilter);
	}

	@Get('category')
	@Public()
	findAllCategories(@Query('page') page?: string, @Query('limit') limit?: string){
		if(!validateParameters(page, limit)) throw new InternalServerErrorException('Parametros inválidos')
		const options: any = {};
		if (page) options.page = Number(page);
		if (limit) options.limit = Number(limit);

		return this.productsCategoryService.findAll(Object.keys(options).length ? options : {});
	}

	@Get(':id')
	@Public()
	async findOne(@Param('id') id: string) {
		if(!validateParameters(id)) throw new InternalServerErrorException('Parametros inválidos')
		const product = await this.productsService.findOne(+id);
		return product? product : 'No se ha encontrado el producto.'
	}

	@Get('category/:id')
	@Roles(UserRole.CLIENT, UserRole.VENDOR, UserRole.ADMIN)
	async findOneCategory(@Param('id') id: string){
		if(!validateParameters(id)) throw new InternalServerErrorException('Parametros inválidos')
		const category = await this.productsCategoryService.findOne(+id)
		return category? category : 'No se ha encontrado la categoría'
	}

	@Post()
	@Roles(UserRole.VENDOR, UserRole.ADMIN)
	create(@Body() createProductDto: CreateProductDto, @Request() req) {
		createProductDto.vendorId = req.user.vendorProfileId
		return this.productsService.create(createProductDto);
	}

	@Post('category')
	@Roles(UserRole.VENDOR, UserRole.ADMIN)
	createCategory(@Body() createCategoryDto: CreateCategoryDto){
		return this.productsCategoryService.create(createCategoryDto)
	}

	@Patch(':id')
	@Roles(UserRole.VENDOR, UserRole.ADMIN)
	async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
		if(!validateParameters(id)) throw new InternalServerErrorException('Parametros inválidos')
        const product = await this.productsService.findOne(+id)
		if (!product) throw new InternalServerErrorException('Producto no encontrado')
		return this.productsService.update(+id, updateProductDto);
	}

	@Patch('category/:id')
	@Roles(UserRole.ADMIN)
	async updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto){
		if(!validateParameters(id)) throw new InternalServerErrorException('Parametros inválidos');
		const category = await this.productsCategoryService.findOne(+id);
		if(!category) throw new InternalServerErrorException('Categoría no encontrada o válida');
		return this.productsCategoryService.update(+id, updateCategoryDto);
	}

	@Delete(':id')
	@Roles(UserRole.VENDOR, UserRole.ADMIN)
	async remove(@Param('id') id: string) {
		if(!validateParameters(id)) throw new InternalServerErrorException('Parametros inválidos');
		const product = await this.productsService.findOne(+id);
		if (!product) throw new InternalServerErrorException('Producto no encontrado o registrado como propio');
		return this.productsService.delete(+id);
	}

	@Delete('category/:id')
	@Roles(UserRole.ADMIN)
	async deleteCategory(@Param('id') id: string){
		if(!validateParameters(id)) throw new InternalServerErrorException('Parametros inválidos');
		const category = await this.productsCategoryService.findOne(+id);
		if(!category) throw new InternalServerErrorException('Categoría no encontrada o válida');
		return this.productsCategoryService.delete(+id);
	}
}
