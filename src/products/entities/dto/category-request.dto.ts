import { Expose } from "class-transformer";


export class CategoryRequestDto{
    @Expose()
    name: string;
}