import { IsString, IsBoolean, IsOptional, Length } from 'class-validator';

export class CreateVendorDto {
  @IsString()
  @Length(2, 50)
  name: string;

  @IsString()
  @Length(5, 100)
  address: string;

  @IsString()
  @Length(6, 20)
  phone: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  //Agregar campos de orders que se puedan necesitar a la hora de modificar el usuario
}
