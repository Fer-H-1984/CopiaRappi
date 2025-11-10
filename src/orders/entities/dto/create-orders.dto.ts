import { IsEnum, IsOptional, IsPositive, IsString, IsInt, IsNumber, IsArray, ValidateNested } from "class-validator";
import { User } from "src/users/entities/user/user.entity";
import { Driver } from "src/drivers/entities/drivers/driver.entity";
import { OrderStatus } from "../orders/orders.entity";
import { Type } from "class-transformer";
import { CreatePaymentDto } from "src/payments/payments/dto/create-payment.dto";

class OrderItemDto {
  @IsNumber()
  productId: number;

  @IsInt()
  @IsPositive()
  quantity: number;
}
 
export class CreateOrdersDto {

    @IsOptional()
    readonly User: User;   

    @IsOptional()
    readonly driver: Driver;
     
    @IsEnum(OrderStatus, { message: 'status must be one of PENDING, IN_PROGRESS, COMPLETED, CANCELLED' })
    status: OrderStatus;

    @IsNumber()
    @IsPositive({ message: 'El monto total debe ser un número positivo' })
    readonly totalAmount: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

    @IsOptional()
    @ValidateNested()
    @Type(() => CreatePaymentDto)
    payment?: CreatePaymentDto;

    @IsOptional()
    trackingNumber: string

}