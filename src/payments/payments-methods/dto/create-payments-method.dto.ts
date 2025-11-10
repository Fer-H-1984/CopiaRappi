import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreatePaymentsMethodDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsBoolean()
    isActive: boolean;
}
