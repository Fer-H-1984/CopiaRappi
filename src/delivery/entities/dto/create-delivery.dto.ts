import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateDeliveryDto {
  @IsString()
  recipientName: string;

  @IsString()
  address: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsInt()
  driverId?: number;

  @IsInt()
  orderId: number;  // Obligatorio para relacionar con Order
}
