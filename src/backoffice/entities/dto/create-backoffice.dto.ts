import { IsString, Length } from 'class-validator';

export class CreateBackofficeDto {
  @IsString()
  @Length(3, 20)
  readonly username: string;

  @IsString()
  @Length(8, 50)
  readonly password: string;
}
