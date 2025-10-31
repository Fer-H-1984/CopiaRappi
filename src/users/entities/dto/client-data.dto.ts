import { UserRole } from '../user/user';
import { IsEnum, IsNumber } from 'class-validator';

export class ClientDataDto {

    @IsNumber()
    id: number;

    @IsEnum(UserRole, { message: 'role must be one of ADMIN, VENDOR, CLIENT, DRIVER' })
    role: UserRole.CLIENT;
}
