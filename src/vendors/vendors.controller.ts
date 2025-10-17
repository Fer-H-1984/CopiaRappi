import { Controller, Patch, Param, Body } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { UpdateVendorAvailabilityDto } from './entities/dto/update-vendor-availability.dto';

@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Patch(':id/availability')
  updateAvailability(
    @Param('id') id: string,
    @Body() dto: UpdateVendorAvailabilityDto,
  ) {
    return this.vendorsService.setAvailability(id, dto.available);
  }
}
