import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BackofficeService } from './backoffice.service';
import { BackofficeController } from './backoffice.controller';
import { Backoffice } from './entities/backoffice/backoffice';

@Module({
  imports: [TypeOrmModule.forFeature([Backoffice])],
  providers: [BackofficeService],
  controllers: [BackofficeController],
  exports: [BackofficeService],
})
export class BackofficeModule {}
