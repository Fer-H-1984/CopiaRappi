import { IsDecimal, IsEnum, IsOptional, IsPositive, IsString } from "class-validator";
import { User } from "src/users/entities/user/user.entity";
import { Driver } from "src/drivers/entities/drivers/drivers.entity";
import { OrderStatus } from "../orders/orders.entity";
 
export class CreateOrdersDto {

    @IsOptional()
    readonly User: User;   

    @IsOptional()
    readonly driver: Driver;
     
    @IsEnum({OrderStatus}, { message: 'status must be one of PENDING, IN_PROGRESS, COMPLETED, CANCELLED' })
    readonly status: OrderStatus;

    @IsDecimal({ decimal_digits: '0,2' }, { message: 'El monto total debe ser un número decimal válido con hasta dos decimales' })
    @IsPositive({ message: 'El monto total debe ser un número positivo' })
    readonly totalAmount: number;

    @IsOptional()
    readonly items?: Array<{
        productId: number;
        quantity: number;
        price: number;
    }>;

    @IsOptional()
    @IsString()
    readonly paymentMethod?: string;

}