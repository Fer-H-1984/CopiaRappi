import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorsController } from './vendors.controller';
import { VendorsService } from './vendors.service';
import { Vendor } from './entities/vendors/vendors';

@Module({
  imports: [TypeOrmModule.forFeature([Vendor])], // <--- registra la entidad para inyección
  controllers: [VendorsController],
  providers: [VendorsService],
})
export class VendorsModule {}
