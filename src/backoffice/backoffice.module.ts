import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BackofficeController } from './backoffice.controller';
import { BackofficeService } from './backoffice.service';
import { Admin } from './entities/backoffice/backoffice';

// 🔗 IMPORTAR MÓDULOS RELACIONADOS
import { DriversModule } from '../drivers/drivers.module';
import { UsersModule } from '../users/users.module';
import { OrdersModule } from '../orders/orders.module';
import { VendorsModule } from '../vendors/vendors.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Admin]),
    
    DriversModule,  
    UsersModule,    
    OrdersModule,   
    VendorsModule,  
  ],
  controllers: [
    BackofficeController,   
  ],
  providers: [
    BackofficeService,  
  ],
  exports: [
    BackofficeService,  
  ],
})
export class BackofficeModule {}