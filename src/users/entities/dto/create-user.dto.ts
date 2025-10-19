import { IsEmail, IsNumber, IsOptional, IsString, Length } from "class-validator";


export class CreateUserDto {

    @IsString()
    @Length(2, 20)
    readonly name: string;

    @IsString()
    @IsEmail()
    @Length(5, 25)
    readonly email: string;

    @IsString()
    @Length(8, 20)
    readonly password: string;

    @IsOptional()
    readonly address?:{
        street: string;
    }

    @IsOptional()
    @IsNumber()
    readonly addressId?: number;
}