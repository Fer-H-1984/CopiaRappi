import { IsString, IsOptional, IsNumberString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  // price como string para DECIMAL en DB
  @IsNumberString()
  price: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  vendorId?: number;
}