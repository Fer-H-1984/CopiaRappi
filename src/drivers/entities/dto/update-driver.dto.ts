import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsBoolean, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { DriverStatus } from '../drivers/driver.entity';
import { CreateDriverDto } from './create-driver.dto';
 
export class UpdateDriverDto extends PartialType(CreateDriverDto) {
  
  @IsEnum(DriverStatus)
  @IsOptional()
  status?: DriverStatus;

  @IsBoolean()
  @IsOptional()
  documentsVerified?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(5)
  rating?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  totalDeliveries?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  totalEarnings?: number;
}
