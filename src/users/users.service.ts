import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user/user';
import { ServiceInterface } from 'src/shared/interfaces/service.interface';
import { CreateUserDto } from './entities/dto/create-user.dto';
import { Address } from './entities/user/address';
import { UpdateUserDto } from './entities/dto/update-user.dto';
import { Vendor } from 'src/vendors/entities/vendors/vendors';

@Injectable()
export class UsersService implements ServiceInterface {
    constructor(
        @InjectRepository(User) 
        private readonly userRepository: Repository<User>,
        @InjectRepository(Address)
        private readonly addressRepository: Repository<Address>,
        @InjectRepository(Vendor)
        private readonly vendorRepository: Repository<Vendor>
    ) {}

    findAll(): Promise<User[]> {
        return this.userRepository.find({
            relations: ['address'],
        });
    }

    findAddress() : Promise<Address[]> {
        return this.addressRepository.find();
    }

    findOne(id: number): Promise<User | null> {
        return this.userRepository.findOne({
            where: { id: id },
            relations: ['favoriteVendors'],
        });
    }

    findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({
            where: { email: email },
        });
    }
        
    async create(data: CreateUserDto): Promise<User> {
        try {
            let address: Address | undefined;
            let emailLower = data.email.toLowerCase();

            if (data.address) {
                address = this.addressRepository.create(data.address);
                await this.addressRepository.save(address);
            }

            const user = this.userRepository.create({

                ...data,
                email: emailLower,
                address,
            });

            return await this.userRepository.save(user);

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error al crear el usuario:', error.message);
            }
            else {
                console.error('Error desconocido al crear el usuario:', error);
            }
            
            throw new InternalServerErrorException(
                'Error al crear el usuario. Por favor, inténtalo de nuevo más tarde.'
            );
        }
        
    }

    update(id: number, body: UpdateUserDto): Promise<any> {
        return this.userRepository.update(id, body);
    }


    async toggleFavoriteVendor(userId: number, vendorId: number) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['favoriteVendors'],
        });

        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        const vendor = await this.vendorRepository.findOne({
            where: { id: vendorId },
        });

        if (!vendor) {
            throw new NotFoundException('Restaurante no encontrado');
        }

        const isFavorite = user.favoriteVendors.some(v => v.id === Number(vendorId));

        if (isFavorite) {
            await this.userRepository
            .createQueryBuilder()
            .relation(User, 'favoriteVendors')
            .of(user)
            .remove(vendor);
        } else {
            await this.userRepository
            .createQueryBuilder()
            .relation(User, 'favoriteVendors')
            .of(user)
            .add(vendor);
        }

        return this.userRepository.findOne({
            where: { id: userId },
            relations: ['favoriteVendors'],
        });
    }

    delete(id: number): Promise<any> {
        return this.userRepository.delete(id);
    }

}
