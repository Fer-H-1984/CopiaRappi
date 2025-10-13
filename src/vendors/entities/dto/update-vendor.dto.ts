import { PartialType } from '@nestjs/mapped-types';
import { CreateVendorDto } from './create-vendor.dto';
export class UpdateVendorDto extends PartialType(CreateVendorDto) {}
/*Explicación:

PartialType(CreateVendorDto):

Toma todos los campos de CreateVendorDto (name, address, phone, isActive).

Los convierte en opcionales automáticamente.

Esto significa que cuando hagas un PATCH /vendors/:id, podés enviar solo los campos que quieras actualizar, por ejemplo:*/