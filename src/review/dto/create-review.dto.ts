import { IsInt, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";


export class CreateReviewDto {
    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;

    @IsString()
    @IsOptional()
    comment?: string;

    @IsOptional()
    @IsNumber()
    userId: number;

    @IsNumber()
    vendorId: number;
}
