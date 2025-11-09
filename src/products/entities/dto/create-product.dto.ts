import { IsString, IsDecimal, IsOptional, IsNotEmpty, Length, IsPositive, IsNumber, IsBoolean } from 'class-validator';


export class CreateProductDto {

    @IsString()
    @IsNotEmpty({ message: 'El nombre del producto no debe estar vacío' })
    @Length(2, 50)
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNumber()
    @IsPositive({ message: 'El precio debe ser un número positivo' })
    price: number;

    @IsNumber()
    @IsPositive({ message: 'El stock debe ser un número positivo' })
    stock: number;

    @IsOptional()
    @IsString()
    imageURL?: string;

    @IsNumber()
    categoryId: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsNumber()
    @IsOptional()
    vendorId: number;
}