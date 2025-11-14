import { 
  IsString, 
  IsEnum, 
  IsOptional, 
  IsNumber, 
  Length, 
  IsDateString,
  IsUrl,
  Min,
  Max
} from 'class-validator';
import { VehicleType } from '../drivers/driver.entity';


export class CreateDriverDto {
  
  // INFORMACIÓN PERSONAL (OBLIGATORIA)
  
  @IsString()
  @IsOptional()
  @Length(10, 20, { message: 'El teléfono debe tener entre 10 y 20 caracteres' })
  phone?: string;

  @IsUrl({}, { message: 'La foto debe ser una URL válida' })
  @IsOptional()
  photo?: string;

  // INFORMACIÓN DEL VEHÍCULO
  
  @IsEnum(VehicleType, { message: 'El tipo de vehículo debe ser MOTORCYCLE, BICYCLE o CAR'})
  vehicleType?: VehicleType;

  @IsString()
  @IsOptional()
  @Length(6, 10, { message: 'La patente debe tener entre 6 y 10 caracteres' })
  licensePlate?: string;

  @IsString()
  @IsOptional()
  @Length(2, 50)
  vehicleBrand?: string;

  @IsString()
  @IsOptional()
  @Length(2, 50)
  vehicleModel?: string;

  @IsNumber()
  @IsOptional()
  @Min(1980, { message: 'El año del vehículo no puede ser menor a 1980' })
  @Max(new Date().getFullYear() + 1, { message: 'El año del vehículo no es válido' })
  vehicleYear?: number;

  // DOCUMENTACIÓN
  
  @IsString()
  @IsOptional()
  @Length(5, 30)
  driverLicense?: string;

  @IsDateString()
  @IsOptional()
  licenseExpiryDate?: string; // Formato: "2025-12-31"

  @IsString()
  @IsOptional()
  insurancePolicy?: string;
  
  @IsNumber()
  @IsOptional()
  userId?: number; 
}






