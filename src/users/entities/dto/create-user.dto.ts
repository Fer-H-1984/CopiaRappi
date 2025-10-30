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
    readonly vendorProfile?: {
        shopName: string;
    }

    @IsOptional()
    readonly driver?: {
        vehicleType: string;
        licensePlate: string;
    }

    @IsOptional()
    readonly backOffice?: {

    }

    @IsEnum(UserRole,  { message: 'role must be one of ADMIN, VENDOR, CLIENT, DRIVER' })
    readonly role: UserRole;

}