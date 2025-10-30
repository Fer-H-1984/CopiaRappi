import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user/user';
import { ServiceInterface } from 'src/shared/interfaces/service.interface';
import { CreateUserDto } from './entities/dto/create-user.dto';
import { Address } from './entities/user/address';
import { UpdateUserDto } from './entities/dto/update-user.dto';
import { Vendor } from 'src/vendors/entities/vendors/vendors';
import { UserRole } from './entities/user/user';
import { VendorsService } from 'src/vendors/vendors.service';
import { CreateVendorDto } from 'src/vendors/entities/dto/create-vendor.dto';
import { CreateDriverDto } from 'src/drivers/entities/dto/create-driver.dto';
import { DriversService } from 'src/drivers/drivers.service';
import { BackofficeService } from 'src/backoffice/backoffice.service';
import { CreateBackofficeDto } from 'src/backoffice/entities/dto/create-backoffice.dto';
import { LoginUserDTO } from './entities/dto/login-user.dto';

@Injectable()
export class UsersService implements ServiceInterface {
    constructor(
        @InjectRepository(User) 
        private readonly userRepository: Repository<User>,
        @InjectRepository(Address)
        private readonly addressRepository: Repository<Address>,
        @InjectRepository(Vendor)
        private readonly vendorRepository: Repository<Vendor>,

        private readonly vendorsService: VendorsService,
        private readonly driversService: DriversService,
        private readonly backofficeService: BackofficeService,
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
            relations: ['favoriteVendors', 'vendorProfile'],
        });
    }

    async findByEmail(email: string) {
        const user = await this.userRepository.findOne({
            where: { email: email },
        });
        return user

    }
        
    async create(data: CreateUserDto): Promise<User> {
        try {
            let address: Address | undefined;
            let emailLower = data.email.toLowerCase();
            let savedEntity;
            let dto;

            if (data.address) {
                address = this.addressRepository.create(data.address);
                await this.addressRepository.save(address);
            }

            const {vendorProfile, backOffice: backOfficeProfile, driverProfile: driverProfile, ...restData} = data;
            const user = this.userRepository.create({
                ...restData,
                email: emailLower,
                address,
            });

            const savedUser = await this.userRepository.save(user);
            
            //verificar si se puede refactorizar el siguiente codigo, ya que es repetitivo. Tambien averiguar si se puede agregar constructores en los dtos
            if (savedUser.role === UserRole.VENDOR && vendorProfile) {
                dto = new CreateVendorDto();
                dto.shopName = vendorProfile.shopName;
                dto.UserId = savedUser.id;
                console.log('Creando perfil de vendedor con los siguientes datos:', dto);
                savedEntity = await this.vendorsService.create(dto);
    
                savedUser.vendorProfile = savedEntity;
                savedUser.vendorProfileId = savedEntity.id;
                await this.userRepository.save(savedUser);
            }
            else if (savedUser.role === UserRole.DRIVER && driverProfile) {
                dto = new CreateDriverDto();
                dto.licensePlate = driverProfile.licensePlate;
                dto.vehicleType = driverProfile.vehicleType;
                dto.UserId = savedUser.id;
                console.log('Creando perfil de conductor con los siguientes datos:', dto);
                savedEntity = await this.driversService.create(dto);
    
                savedUser.driverProfile = savedEntity;
                savedUser.driverProfileId = savedEntity.id;
                await this.userRepository.save(savedUser);
            }
            else if (savedUser.role === UserRole.ADMIN && backOfficeProfile) {
                dto = new CreateBackofficeDto();
                dto.UserId = savedUser.id;
                console.log('Creando perfil de administrador con los siguientes datos:', dto);
                savedEntity = await this.backofficeService.create(dto);
    
                savedUser.backOfficeProfile = savedEntity;
                savedUser.backOfficeProfileId = savedEntity.id;
                await this.userRepository.save(savedUser);
            }
            
            return savedUser;

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

    //falta agregar la autenticacion jwt
    async logIn(CreateUserDto: CreateUserDto): Promise<User>{
        try{
            const user = await this.findByEmail(CreateUserDto.email)
            
            if(!user){
                this.create(CreateUserDto)
                throw new NotFoundException('No se ha encontrado el usuario.')
            }

            if(user.password !== CreateUserDto.password){
                throw new UnauthorizedException('Contraseña incorrecta')
            }

            return user
        }
        catch(error: unknown){
            if(error instanceof Error){
                console.log(error.message)
            }
            else{
                console.log('Error al iniciar sesión: '+ error)
            }
            throw new InternalServerErrorException(
                'Error al iniciar sesión. Por favor intente nuevamente más tarde'
            )
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
