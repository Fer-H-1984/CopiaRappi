import { forwardRef, Module } from '@nestjs/common';
import { SupportService } from './support.service';
import { SupportController } from './support.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Support } from './entities/support.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports:[TypeOrmModule.forFeature([Support]), forwardRef(() => UsersModule)],
  controllers: [SupportController],
  providers: [SupportService],
  exports: [TypeOrmModule, SupportService]
})
export class SupportModule {}
