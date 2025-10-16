import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceInterface } from 'src/shared/interfaces/service.interface';
import { Admin } from './entities/backoffice/backoffice';
import { Repository } from 'typeorm';
import { CreateBackofficeDto } from './entities/dto/create-backoffice.dto';
import { UpdateBackofficeDto } from './entities/dto/update-backoffice.dto';

@Injectable()
export class BackofficeService implements ServiceInterface{

    constructor(
        @InjectRepository(Admin)
        private readonly backofficeRepository : Repository<Admin>
    ){}

    
    findAll() {
        return this.backofficeRepository.find()
    }

    create(body: CreateBackofficeDto): Promise<Admin> {
        this.backofficeRepository.create(body)
        return this.backofficeRepository.save(body)
    }
    
    update(id: number, body: UpdateBackofficeDto) {
        return this.backofficeRepository.update(id, body)
    }

    delete(id: number) {
        return this.backofficeRepository.delete(id)
    }
}
