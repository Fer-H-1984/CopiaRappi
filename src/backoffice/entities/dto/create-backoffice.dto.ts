import { IsNumber } from "class-validator";

export class CreateBackofficeDto {

    @IsNumber()
    UserId: number;
}