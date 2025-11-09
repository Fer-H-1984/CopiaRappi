import { Expose, Type } from 'class-transformer';
import { PaymentMethodDto } from 'src/payments/payments-methods/dto/payments-method-summary.dto';
import { UserSummaryDto } from 'src/users/entities/dto/user-summary.dto';
import { PaymentStatus } from '../entities/payment.entity';

export class PaymentResponseDto{
    @Expose()
    id: number;

    @Expose()
    status: PaymentStatus;

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
    @Type(() => UserSummaryDto)
    user: UserSummaryDto;
}