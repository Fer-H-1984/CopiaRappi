import { User } from "src/users/entities/user/user";

export class CreateOrdersDto {
    readonly User: User;
    readonly createdAt: Date;    
    readonly status?: string;
}