import { IsString, IsDecimal, IsOptional, IsNotEmpty, Length, IsPositive } from 'class-validator';


export class CreateProductDto {

    @IsString()
    @IsNotEmpty({ message: 'El nombre del producto no debe estar vacío' })
    @Length(2, 50)
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsDecimal({ decimal_digits: '0,2' }, { message: 'El precio debe ser un número decimal válido con hasta dos decimales' })
    @IsPositive({ message: 'El precio debe ser un número positivo' })
    price: number;
}