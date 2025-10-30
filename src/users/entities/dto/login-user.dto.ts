import {IsEmail, IsString, Length} from "class-validator"

export class LoginUserDTO{
    @IsString()
    @IsEmail()
    @Length(6, 25)
    email:string

    @IsString()
    @Length(4, 20)
    password: string
}