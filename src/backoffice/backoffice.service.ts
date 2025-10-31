import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IServiceInterface } from 'src/shared/interfaces/service.interface';
import { Admin } from './entities/backoffice/backoffice';
import { Repository } from 'typeorm';
import { CreateBackofficeDto } from './entities/dto/create-backoffice.dto';
import { UpdateBackofficeDto } from './entities/dto/update-backoffice.dto';

@Injectable()
export class BackofficeService implements IServiceInterface <Admin, CreateBackofficeDto, UpdateBackofficeDto> {

    constructor(
        @InjectRepository(Admin)
        private readonly backofficeRepository : Repository<Admin>
    ){}

    
    findAll() {
        return this.backofficeRepository.find()
    }

    async findOne(id: number): Promise<Admin> {
        const admin = await this.backofficeRepository.findOneBy({ id });
        if (!admin) {
            throw new NotFoundException(`Admin con id ${id} no encontrado`);
        }
        return admin;
    }

    async create(body: CreateBackofficeDto): Promise<Admin> {
        // mapear DTO a entidad (asegura tipos compatibles)
        const admin = this.backofficeRepository.create(body as Partial<Admin>);
        return this.backofficeRepository.save(admin);
    }
    
    async update(id: number, body: UpdateBackofficeDto): Promise<any> {
        const existing = await this.backofficeRepository.findOneBy({ id });
        if (!existing) throw new NotFoundException('Admin not found');

        // mergea los cambios y guarda la entidad completa
        const merged = this.backofficeRepository.merge(existing, body as Partial<Admin>);
        return this.backofficeRepository.save(merged);
    }

    delete(id: number) : Promise<any> {
        return this.backofficeRepository.delete(id)
    }
}
