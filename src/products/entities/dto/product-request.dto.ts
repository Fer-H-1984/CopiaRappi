import { Expose, Type } from "class-transformer";
import { CategoryRequestDto } from "./category-request.dto";


export class ProductRequestDto{
    @Expose()
    name: string;

    @Expose()
    imageUrl: string;

    @Expose()
    description: string;

    @Expose()
    isAvailable: boolean;

    @Expose()
    @Type(() => CategoryRequestDto)
    category: CategoryRequestDto;

    @Expose()
    price: number
}