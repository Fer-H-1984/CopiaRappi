import { User } from "src/users/entities/user/user";
import { Driver } from "src/drivers/entities/drivers/drivers";

export class CreateOrdersDto {
    readonly User: User;
    readonly createdAt: Date;    
    readonly driver: Driver;
    readonly status?: string;
}