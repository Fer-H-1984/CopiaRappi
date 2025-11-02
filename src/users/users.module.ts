import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user/user.entity';
import { Address } from './entities/user/address.entity';
import { OrdersModule } from 'src/orders/orders.module';
import { VendorsModule } from 'src/vendors/vendors.module';
import { BackofficeModule } from 'src/backoffice/backoffice.module';
import { DriversModule } from 'src/drivers/drivers.module';
import { ReviewModule } from 'src/review/review.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address]), OrdersModule, VendorsModule, BackofficeModule, DriversModule, forwardRef(() => ReviewModule)],
  providers: [UsersService],
  controllers: [UserController],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
