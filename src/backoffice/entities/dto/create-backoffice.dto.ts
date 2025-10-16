import { IsBoolean, IsString } from "class-validator";

export class CreateBackofficeDto {

    @IsString()
    readonly username: string;

    @IsString()
    readonly password: string;

    @IsBoolean()
    readonly isActive?: boolean;
}