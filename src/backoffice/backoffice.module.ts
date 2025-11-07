import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BackofficeController } from './backoffice.controller';
import { BackofficeService } from './backoffice.service';
import { Admin } from './entities/backoffice/backoffice.entity';
import { DriversModule } from 'src/drivers/drivers.module';

@Module({
  imports: [TypeOrmModule.forFeature([Admin]), DriversModule],
  controllers: [BackofficeController],
  providers: [BackofficeService],
  exports: [TypeOrmModule, BackofficeService]
})
export class BackofficeModule {}