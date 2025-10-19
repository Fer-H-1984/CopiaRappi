import { PartialType } from '@nestjs/mapped-types';
import { CreateOrdersDto } from './create-orders.dto';

export class UpdateOrderDto extends PartialType(CreateOrdersDto) {}
