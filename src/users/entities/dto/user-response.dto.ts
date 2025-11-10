
import { Expose } from "class-transformer";
import { Address } from "../user/address.entity";
import { UserRole } from "../user/user.entity";

/**
 * Dto para enviar datos completos de usuario
*/
export class UserResponseDto{

    @Expose()
    id: number

    @Expose()
    name: string

    @Expose()
    email: string

    @Expose()
    isActive: boolean

    @Expose()
    address: Address

    @Expose()
    role: UserRole
}