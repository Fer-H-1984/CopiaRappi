import { Injectable } from "@nestjs/common";
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

    create(data: CreateCategoryDto): Promise<CategoryRequestDto> {
        data.name.toLowerCase().trim();
        
        const category = this.categoryRepository.create(data);
        this.categoryRepository.save(category);

        const dtoCategory = new CategoryRequestDto();
        dtoCategory.name = category.name;
        return dtoCategory as unknown as Promise<CategoryRequestDto>;
    }

    findAll(options?: { page?: number; limit?: number;[key: string]: any; }): Promise<Category[] | PaginatedResult<Category> | CategoryRequestDto[] | PaginatedResult<CategoryRequestDto>> {
        if(options?.page && options?.limit) return paginate(this.categoryRepository, options.page, options.limit);
        return this.categoryRepository.find();
    }

    findOne(id: number): Promise<Category | null> {
        return this.categoryRepository.findOne({ where:{id} });
    }

    update(id: number, data: UpdateCategoryDto): Promise<any> {
        data.name?.toLowerCase().trim();
        return this.categoryRepository.update(id, data);
    }

    delete(id: number): Promise<any> {
        return this.categoryRepository.delete(id);
    }
}