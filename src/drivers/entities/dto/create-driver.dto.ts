import { IsNumber, IsString } from "class-validator";


export class CreateDriverDto {

    @IsString()
    vehicleType: string;

    @IsString()
    licensePlate: string;

    @IsNumber()
    UserId:number;
}