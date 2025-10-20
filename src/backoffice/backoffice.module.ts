import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BackofficeService } from './backoffice.service';
import { BackofficeController } from './backoffice.controller';
import { Backoffice } from './entities/backoffice/backoffice';

@Module({
  imports: [TypeOrmModule.forFeature([Backoffice])],
  controllers: [BackofficeController],
  providers: [BackofficeService],
  exports: [BackofficeService],
})
export class BackofficeModule {}
