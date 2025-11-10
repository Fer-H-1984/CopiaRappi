import { forwardRef, Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/orders/orders.entity';
import { OrderItem } from './entities/orders/order-item.entity';
import { UsersModule } from 'src/users/users.module';
import { ProductsModule } from 'src/products/products.module';
import { PaymentsModule } from 'src/payments/payments/payments.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem]), forwardRef(() => UsersModule), forwardRef(() => ProductsModule), forwardRef(() => PaymentsModule)],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [TypeOrmModule, OrdersService],
})
export class OrdersModule {}
