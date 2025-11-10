import { forwardRef, Module } from '@nestjs/common';
import { PaymentsMethodsService } from './payments-methods.service';
import { PaymentsMethodsController } from './payments-methods.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsMethod } from './entities/payments-method.entity';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentsMethod]), forwardRef(() => PaymentsModule)  ],
  controllers: [PaymentsMethodsController],
  providers: [PaymentsMethodsService],
  exports: [PaymentsMethodsService, TypeOrmModule]
})
export class PaymentsMethodsModule {}
