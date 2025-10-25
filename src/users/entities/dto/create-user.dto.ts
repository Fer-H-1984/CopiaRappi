import { IsEmail, IsEnum, IsNumber, IsOptional, IsString, Length } from "class-validator";
import { UserRole } from "../user/user";



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

    @IsOptional()
    @IsNumber()
    readonly vendorId?: number

    @IsOptional()
    @IsNumber()
    readonly driverId?: number

    @IsOptional()
    @IsNumber()
    readonly backOfficeId?: number

    @IsEnum({UserRole})
    readonly role: UserRole.CLIENT;

}