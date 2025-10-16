import { IsDate, IsOptional, IsString } from "class-validator";
import { User } from "src/users/entities/user/user";
import { Driver } from "src/drivers/entities/drivers/drivers";
import { Type } from "class-transformer";
 
export class CreateOrdersDto {

    readonly User: User;

    @Type(() => Date)
    @IsDate()
    readonly createdAt: Date;    

    readonly driver: Driver;
    
    @IsOptional()
    @IsString()
    readonly status?: string;
}