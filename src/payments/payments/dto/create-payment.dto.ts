import { IsNumber } from "class-validator";

export class CreatePaymentDto {
    @IsNumber()
    orderId: number;

    @IsNumber()
    userId: number;

    @IsNumber()
    amount: number;

    @IsNumber()
    methodId: number;

}
