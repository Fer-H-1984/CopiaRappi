import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateOrdersDto {
  @IsNumber()
  readonly userId: number;

  @Type(() => Date)
  @IsDate()
  readonly createdAt: Date;

  @IsOptional()
  @IsString()
  readonly status?: string;

  @IsOptional()
  @IsNumber()
  readonly driverId?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly deliveredAt?: Date;
}
