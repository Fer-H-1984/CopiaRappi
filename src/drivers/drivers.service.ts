import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from './entities/drivers/drivers';
import { CreateDriverDto } from './entities/dto/create-driver.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class DriversService {
    constructor(
        @InjectRepository(Driver)
        private readonly driverRepo: Repository<Driver>,
    ) {}

    findAll(): Promise<Driver[]>{
        return this.driverRepo.find();
    }

    async createDemo(): Promise<Driver> {
        const demo = this.driverRepo.create({
            name: 'Jose',
            email: `Jose${Date.now()}@email.com`,
            phone: '123456789',
            passwordHash: 'demo123',
            status: 'available'
        });
        return this.driverRepo.save(demo);
    }

    async register(createDriverDto: CreateDriverDto): Promise<Driver> {
        const { name, email, phone, password} = createDriverDto;
        
        const exists = await this.driverRepo.findOne({ where: {email}});
        if(exists) {
            throw new BadRequestException('El email ta esta registrado');
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newDriver = this.driverRepo.create({
            name,
            email,
            phone,
            passwordHash,
            status: 'inactive',
        });
        return this.driverRepo.save(newDriver);
    }

    
}
