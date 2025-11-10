import { Expose } from "class-transformer";

export class PaymentMethodDto {
    @Expose()
    id: number;

    @Expose()
    name: string;
}