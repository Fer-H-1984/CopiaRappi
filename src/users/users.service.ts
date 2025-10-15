import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user/user';
import { ServiceInterface } from 'src/shared/interfaces/service.interface';
import { CreateUserDto } from './entities/dto/create-user.dto';
import { Address } from './entities/user/address';
import { UpdateUserDto } from './entities/dto/update-user.dto';

@Injectable()
export class UsersService implements ServiceInterface {
    constructor(
        @InjectRepository(User) 
        private readonly userRepository: Repository<User>,
        @InjectRepository(Address)
        private readonly addressRepository: Repository<Address>
    ) {}

    findAll(): Promise<User[]> {
        return this.userRepository.find({
            relations: ['address']
        });
    }

    findAddress() : Promise<Address[]> {
        return this.addressRepository.find();
    }

    findOne(id: number): Promise<User | null> {
        return this.userRepository.findOneBy({ id });
    }
        
    async create(data: CreateUserDto): Promise<User> {
        try {
            let address: Address | undefined;

            if (data.address) {
                address = this.addressRepository.create(data.address);
                await this.addressRepository.save(address);
            }

            const user = this.userRepository.create({
                ...data,
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

    delete(id: number): Promise<any> {
        return this.userRepository.delete(id);
    }

}
