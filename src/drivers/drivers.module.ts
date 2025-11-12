import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriversService } from './drivers.service';
import { DriversController } from './drivers.controller';
import { Driver } from './entities/drivers/driver.entity';
import { SupportModule } from 'src/support/support.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Driver]),
    SupportModule
  ],
  controllers: [
    DriversController, 
  ],
  providers: [
    DriversService, 
  ],
  exports: [
    DriversService, 
    TypeOrmModule,   
  ],
})
export class DriversModule {}
