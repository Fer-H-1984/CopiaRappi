import { Expose } from "class-transformer";

export class OrderSummaryDto {
    @Expose()
    id: number;

    @Expose()
    status: string;
}