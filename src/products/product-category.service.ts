import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IServiceInterface } from "src/shared/interfaces/service.interface";
import { Category } from "./entities/products/category.entity";
import { Repository } from "typeorm";
import { CreateCategoryDto } from "./entities/dto/create-category.dto";
import { PaginatedResult } from "src/shared/interfaces/paginatedResult.type";
import { UpdateCategoryDto } from "./entities/dto/update-category.dto";
import { CategoryRequestDto } from "./entities/dto/category-request.dto";
import { paginate } from "src/shared/utils/pagination";


@Injectable()
export class ProductsCategoryService implements IServiceInterface<Category, CreateCategoryDto, UpdateCategoryDto, CategoryRequestDto>{
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>
    ){}

    async create(data: CreateCategoryDto): Promise<CategoryRequestDto> {
        try{
            data.name = data.name.toLowerCase().trim();

            const existing = await this.categoryRepository.findOne({where: {name: data.name}})
            if(existing) throw new InternalServerErrorException('Ya existe esta categoría')
    
            const category = this.categoryRepository.create(data);
            this.categoryRepository.save(category);
    
            const dtoCategory = new CategoryRequestDto();
            dtoCategory.name = category.name;
            return dtoCategory as unknown as Promise<CategoryRequestDto>;
        }
        catch(error: unknown){
            throw new InternalServerErrorException(error)
        }
    }

    findAll(options?: { page?: number; limit?: number;[key: string]: any; }): Promise<Category[] | PaginatedResult<Category> | CategoryRequestDto[] | PaginatedResult<CategoryRequestDto>> {
        if(options?.page && options?.limit) return paginate(this.categoryRepository, options.page, options.limit);
        return this.categoryRepository.find();
    }

    findOne(id: number): Promise<Category | null> {
        return this.categoryRepository.findOne({ where:{id} });
    }

    async update(id: number, data: UpdateCategoryDto): Promise<any> {
        data.name = data.name?.toLowerCase().trim();

        const existing = await this.categoryRepository.findOne({where:{name: data.name}})
        if (existing) throw new InternalServerErrorException('Ya existe esta categoría')
        return this.categoryRepository.update(id, data);
    }

    delete(id: number): Promise<any> {
        return this.categoryRepository.delete(id);
    }
}