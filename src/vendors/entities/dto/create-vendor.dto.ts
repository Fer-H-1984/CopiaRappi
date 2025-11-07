import { IsString, Length, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateVendorDto {
  @IsString()
  @Length(2, 50)
  @IsNotEmpty({ message: 'El nombre de la tienda no debe estar vacío' })
  shopName: string;

  @IsNumber()
  UserId: number;

}
