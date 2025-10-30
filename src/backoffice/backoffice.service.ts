import { Injectable, NotFoundException } from '@nestjs/common';
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

    async create(body: CreateBackofficeDto): Promise<Admin> {
        // mapear DTO a entidad (asegura tipos compatibles)
        const admin = this.backofficeRepository.create(body as Partial<Admin>);
        return this.backofficeRepository.save(admin);
    }
    
    async update(id: number, body: UpdateBackofficeDto): Promise<Admin> {
        const existing = await this.backofficeRepository.findOneBy({ id });
        if (!existing) throw new NotFoundException('Admin not found');

        // mergea los cambios y guarda la entidad completa
        const merged = this.backofficeRepository.merge(existing, body as Partial<Admin>);
        return this.backofficeRepository.save(merged);
    }

    delete(id: number) {
        return this.backofficeRepository.delete(id)
    }
}
