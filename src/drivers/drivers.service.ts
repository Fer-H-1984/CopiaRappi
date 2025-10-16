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

    /* async createDemo(): Promise<Driver> {
        const demo = this.driverRepo.create({
            name: 'Jose',
            email: `Jose${Date.now()}@email.com`,
            phone: '123456789',
            passwordHash: 'demo123',
            status: 'available'
        });
        return this.driverRepo.save(demo);
    } */

    async create(createDriverDto: CreateDriverDto): Promise<Driver> {
        const { name, email, phone, password} = createDriverDto;

        const passwordHash = `hash_${password}`; 
        const emailLower = email.toLowerCase();

        const newDriver = this.driverRepo.create({
            name,
            email: emailLower,
            phone,
            passwordHash,
            status: 'inactive',
        });
        return this.driverRepo.save(newDriver);
    }

    update(id: number, UpdateDriverDto: UpdateDriverDto) {  //aca se debe cambiar el tema id, porque en la db es string y la interface lo tiene como number
        return this.driverRepo.update(id, UpdateDriverDto);
    }

    delete(id: number) { //pasa lo mismo que en update
        return this.driverRepo.delete(id);
    }
    
}
