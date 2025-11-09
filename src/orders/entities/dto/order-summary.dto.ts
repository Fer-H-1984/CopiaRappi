import { Expose, Type } from "class-transformer";
import { OrderStatus } from "../orders/orders.entity";
import { PaymentResponseDto } from "src/payments/payments/dto/payment-response.dto";

export class OrderSummaryDto {
    @Expose()
    id: number;

    @Expose()
    status: OrderStatus;

    @Expose()
    totalAmount: number;

    @Expose()
    totalItems: number;

    @Expose()
    @Type(() => PaymentResponseDto)
    payments: PaymentResponseDto[];
}