import { 
  IsString, 
  IsEnum, 
  IsOptional, 
  IsBoolean, 
  IsNumber, 
  Length, 
  IsDateString,
  IsUrl,
  Min,
  Max
} from 'class-validator';
import { VehicleType, DriverStatus } from '../drivers/driver.entity';


 //  DTO PARA CREAR UN DRIVER

 
export class CreateDriverDto {
  
  // INFORMACIÓN PERSONAL (OBLIGATORIA)
  
  
  @IsString()
  @Length(2, 100, { message: 'El nombre debe tener entre 2 y 100 caracteres' })
  name: string;

  @IsString()
  @IsOptional()
  @Length(10, 20, { message: 'El teléfono debe tener entre 10 y 20 caracteres' })
  phone?: string;

  @IsUrl({}, { message: 'La foto debe ser una URL válida' })
  @IsOptional()
  photo?: string;

  // INFORMACIÓN DEL VEHÍCULO
  
  @IsEnum(VehicleType, { 
    message: 'El tipo de vehículo debe ser MOTORCYCLE, BICYCLE, CAR o SCOOTER' 
  })
  vehicleType: VehicleType;

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

  // RELACIÓN CON USUARIO
  
  @IsNumber()
  @IsOptional()
  userId?: number; 
}






