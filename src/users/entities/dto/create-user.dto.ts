import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Length, MinLength, Matches } from "class-validator";
import { UserRole } from "../user/user.entity";
import { UpdateDriverDto } from "src/drivers/entities/dto/update-driver.dto";

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
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @Matches(/(?=.*[a-z])/, { message: 'La contraseña debe tener al menos una letra minúscula' })
    @Matches(/(?=.*[A-Z])/, { message: 'La contraseña debe tener al menos una letra mayúscula' })
    @Matches(/(?=.*\d)/, { message: 'La contraseña debe tener al menos un número' })
    @Matches(/(?=.*[@$!%*?&])/, { message: 'La contraseña debe tener al menos un carácter especial (@$!%*?&)' })
    readonly password: string;

    @IsOptional()
    readonly address?: {
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
        DriverDto: UpdateDriverDto
    }

    @IsOptional()
    readonly backOffice?: {}

    @IsEnum(UserRole, { message: 'role must be one of ADMIN, VENDOR, CLIENT, DRIVER' })
    readonly role: UserRole;
}
