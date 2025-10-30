import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from './entities/drivers/drivers';
import { CreateDriverDto } from './entities/dto/create-driver.dto';
import { ServiceInterface } from 'src/shared/interfaces/service.interface';
import { UpdateDriverDto } from './entities/dto/update-driver.dto';


@Injectable()
export class DriversService implements ServiceInterface {
    constructor(
        @InjectRepository(Driver)
        private readonly driverRepo: Repository<Driver>,
    ) {}

    findAll(): Promise<Driver[]>{ 
        return this.driverRepo.find();
    }

    findOne(id: number): Promise<Driver | null> {
        return this.driverRepo.findOneBy({id}) || Promise.reject('Driver not found');
    }

    create(createDriverDto: CreateDriverDto): Promise<Driver> {
        this.driverRepo.create(createDriverDto);
        return this.driverRepo.save(createDriverDto);
    }

    update(id: number, UpdateDriverDto: UpdateDriverDto) {  
        return this.driverRepo.update(id, UpdateDriverDto);
    }

    delete(id: number) { 
        return this.driverRepo.delete(id);
    }
    
}
