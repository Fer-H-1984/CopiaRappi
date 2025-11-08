import { Expose, Type } from 'class-transformer';
import { PaymentMethodDto } from 'src/payments/payments-methods/dto/payments-method-summary.dto';
import { OrderSummaryDto } from 'src/orders/entities/dto/order-summary.dto';
import { UserSummaryDto } from 'src/users/entities/dto/user-summary.dto';

export class PaymentResponseDto{
    @Expose()
    id: number;

    @Expose()
    status: string;

    @Expose()
    transactionId: string;

    @Expose()
    amount: number;

    @Expose()
    createdAt: Date;

    @Expose()
    @Type(() => PaymentMethodDto)
    method: PaymentMethodDto;

    @Expose()
    @Type(() => OrderSummaryDto)
    order: OrderSummaryDto;

    @Expose()
    @Type(() => UserSummaryDto)
    user: UserSummaryDto;
}