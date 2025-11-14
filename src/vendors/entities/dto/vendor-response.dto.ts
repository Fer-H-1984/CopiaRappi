import { Expose, Type } from "class-transformer";
import { ProductRequestDto } from "src/products/entities/dto/product-request.dto";


export class VendorResponseDto{
    @Expose()
    shopName: string

    @Expose()
    @Type(() => ProductRequestDto)
    product: ProductRequestDto[]

}