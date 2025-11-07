import { IsBoolean, IsNumber } from 'class-validator';

export class UpdateVendorAvailabilityDto {

  @IsNumber()
  id: number;

  @IsBoolean()
  available: boolean;
}