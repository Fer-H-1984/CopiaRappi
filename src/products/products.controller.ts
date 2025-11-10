import { Controller, Get, Post, Body, Param, Patch, Delete, Request, Query, InternalServerErrorException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './entities/dto/create-product.dto';
import { UpdateProductDto } from './entities/dto/update-product.dto';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/entities/user/user.entity';
import { Public } from 'src/auth/public.decorator';


@Controller('products')
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@Get()
	@Public()
	findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
		const options: any = {};
		if (page) options.page = Number(page);
		if (limit) options.limit = Number(limit);
		return this.productsService.findAll(Object.keys(options).length ? options : {});
	}

	@Get(':id')
	@Public()
	findOne(@Param('id') id: string) {
		return this.productsService.findOne(+id);
	}

	@Post()
	@Roles(UserRole.VENDOR, UserRole.ADMIN)
	create(@Body() createProductDto: CreateProductDto, @Request() req) {
		// opcional: podríamos asignar el vendor desde req.user si es VENDOR
		console.log('aaa'+req.user.vendorProfileId)
		createProductDto.vendorId = req.user.vendorProfileId
		return this.productsService.create(createProductDto);
	}

	@Patch(':id')
	@Roles(UserRole.VENDOR, UserRole.ADMIN)
	async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @Request() req) {
        const product = await this.productsService.findOne(+id)
		console.log(product + "" + req.user.vendorProfileId + " " + product?.vendor.id)
		if (!product || product.vendor.id !== req.user.vendorProfileId) throw new InternalServerErrorException('Producto no encontrado o registrado como propio')
		return this.productsService.update(+id, updateProductDto);
	}

	@Delete(':id')
	@Roles(UserRole.VENDOR, UserRole.ADMIN)
	async remove(@Param('id') id: string, @Request() req) {
		const product = await this.productsService.findOne(+id)
		if (!product || product.vendor.id !== req.user.vendorProfileId) throw new InternalServerErrorException('Producto no encontrado o registrado como propio')
		return this.productsService.delete(+id);
	}
}
