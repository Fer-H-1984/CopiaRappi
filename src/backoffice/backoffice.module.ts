import { Module } from '@nestjs/common';
import { BackofficeController } from './backoffice.controller';
import { BackofficeService } from './backoffice.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/backoffice/backoffice';

@Module({
  imports: [TypeOrmModule.forFeature([Admin])],
  controllers: [BackofficeController],
  providers: [BackofficeService],
  exports: [TypeOrmModule]
})
export class BackofficeModule {}
