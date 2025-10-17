import { IsBoolean } from 'class-validator';

export class UpdateVendorAvailabilityDto {
  @IsBoolean()
  available: boolean;
}