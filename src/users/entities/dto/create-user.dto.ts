import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsStrongPassword, Length } from "class-validator";
import { UserRole } from "../user/user.entity";


export class CreateUserDto {

    @IsNotEmpty({ message: 'El nombre no debe estar vacío' })
    @IsString()
    @Length(2, 20)
    readonly name: string;

    @IsNotEmpty({ message: 'El email no debe estar vacío' })
    @IsString()
    @IsEmail({}, { message: 'El email debe ser válido' })
    @Length(5, 25)
    readonly email: string;

    @IsString()
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
    readonly driverProfile?: {
        vehicleType: string;
        licensePlate: string;
    }

    @IsOptional()
    readonly backOffice?: {

    }

    @IsEnum(UserRole,  { message: 'role must be one of ADMIN, VENDOR, CLIENT, DRIVER' })
    readonly role: UserRole;

}