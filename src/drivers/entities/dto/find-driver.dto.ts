import { IsBoolean, IsOptional } from "class-validator";
import { DriverStatus } from "../drivers/driver.entity";


export class FindDriverDto{
    @IsOptional()
    @IsBoolean()
    status?: DriverStatus;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}