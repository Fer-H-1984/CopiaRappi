import { IsString, Length, IsNumber } from 'class-validator';

export class CreateVendorDto {
  @IsString()
  @Length(2, 50)
  shopName: string;

  @IsNumber()
  UserId: number;

}
