import { IsEmail, IsString } from "class-validator";

export class CreateDriverDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  password: string;
}
