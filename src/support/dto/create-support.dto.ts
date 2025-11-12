import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { SupportCategory } from '../entities/support.entity';


export class CreateSupportDto {
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsEnum(SupportCategory, {message: 'category must be one of ORDER, PAYMENT, ACCOUNT, OTHER'})
    supportCategory: SupportCategory;

    @IsOptional()
    @IsNumber()
    UserId: number;

    @IsOptional()
    @IsNumber()
    targetUserId?: number;
}
