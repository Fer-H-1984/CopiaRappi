import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user/user';
import { Address } from './entities/user/address';
import { OrdersModule } from 'src/orders/orders.module';
import { VendorsModule } from 'src/vendors/vendors.module';
import { BackofficeModule } from 'src/backoffice/backoffice.module';
import { DriversModule } from 'src/drivers/drivers.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address]), OrdersModule, VendorsModule, BackofficeModule, DriversModule],
  providers: [UsersService],
  controllers: [UserController],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
