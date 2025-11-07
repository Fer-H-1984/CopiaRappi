import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentsMethodsModule } from '../payments-methods/payments-methods.module';

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), PaymentsMethodsModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService, TypeOrmModule]
})
export class PaymentsModule {}
