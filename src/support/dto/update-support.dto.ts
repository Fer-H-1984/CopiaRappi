import { IsEnum, IsOptional, IsString } from 'class-validator'
import { SupportStatus } from '../entities/support.entity'

export class UpdateSupportDto {
    @IsEnum(SupportStatus, {message: 'Invalid status'})
    status: SupportStatus;

    @IsOptional()
    @IsString()
    adminComment?: string;
}
