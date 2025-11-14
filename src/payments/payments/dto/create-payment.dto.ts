import { IsNumber, IsOptional } from "class-validator";

export class CreatePaymentDto {
    @IsNumber()
    @IsOptional()
    orderId: number;

    @IsNumber()
    userId: number;

    @IsNumber()
    amount: number;

    @IsNumber()
    methodId: number;

}
