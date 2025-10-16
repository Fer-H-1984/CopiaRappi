import { IsEmail, IsNumber, IsString } from "class-validator";


export class CreateDriverDto {

    @IsString()
    name: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsNumber()
    phone: string;

    @IsString()
    password: string;
}