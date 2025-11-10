import { Expose } from "class-transformer";
import { Category } from "../products/category.entity";


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
    category: Category;
}