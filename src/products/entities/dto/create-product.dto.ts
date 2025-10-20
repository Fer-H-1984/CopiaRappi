// src/products/entities/dto/create-product.dto.ts
import { IsString, IsNumber, IsBoolean, IsOptional, Length, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @Length(2, 100)
  name: string;

  @IsString()
  @Length(5, 1000)
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  vendorId: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}