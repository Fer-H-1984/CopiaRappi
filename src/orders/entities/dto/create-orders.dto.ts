<<<<<<< HEAD
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, IsNumber } from 'class-validator';

=======
import { IsDate, IsOptional, IsString } from "class-validator";
import { User } from "src/users/entities/user/user";
import { Driver } from "src/drivers/entities/drivers/drivers";
import { Type } from "class-transformer";
 
>>>>>>> e716fe339c24da4ca8b27ef0334a8d459b9d3600
export class CreateOrdersDto {
  @IsNumber()
  readonly userId: number;

  @Type(() => Date)
  @IsDate()
  readonly createdAt: Date;

<<<<<<< HEAD
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
=======
    @Type(() => Date)
    @IsDate()
    readonly createdAt: Date;    

    readonly driver: Driver;
    
    @IsOptional()
    @IsString()
    readonly status?: string;
}
>>>>>>> e716fe339c24da4ca8b27ef0334a8d459b9d3600
