import { Expose } from "class-transformer";
import { Payment } from "src/payments/payments/entities/payment.entity";
import { OrderStatus } from "../orders/orders.entity";

export class OrderSummaryDto {
    @Expose()
    id: number;

    @Expose()
    status: OrderStatus;

    @Expose()
    totalAmount: number;

    @Expose()
    payment: Payment;
}