import { IsBoolean, IsNumber, IsOptional } from "class-validator";


export class FilterProductDto{

    @IsOptional()
    @IsNumber()
    categoryId?: number;

    @IsOptional()
    @IsBoolean()
    isAvailable?: boolean;

    
}