import { IsBoolean, IsOptional } from "class-validator";


export class FilterProductDto{

    @IsOptional()
    CategoryName?: string;

    @IsOptional()
    @IsBoolean()
    isAvailable?: boolean;

    
}