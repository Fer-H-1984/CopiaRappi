import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user/user.entity';
import { IServiceInterface } from 'src/shared/interfaces/service.interface';
import { CreateUserDto } from './entities/dto/create-user.dto';
import { Address } from './entities/user/address.entity';
import { UpdateUserDto } from './entities/dto/update-user.dto';
import { UserRole } from './entities/user/user.entity';
import { VendorsService } from 'src/vendors/vendors.service';
import { CreateVendorDto } from 'src/vendors/entities/dto/create-vendor.dto';
import { CreateDriverDto } from 'src/drivers/entities/dto/create-driver.dto';
import { DriversService } from 'src/drivers/drivers.service';
import { BackofficeService } from 'src/backoffice/backoffice.service';
import { CreateBackofficeDto } from 'src/backoffice/entities/dto/create-backoffice.dto';
import { ClientDataDto } from './entities/dto/client-data.dto';
import { PaginatedResult } from 'src/shared/interfaces/paginatedResult.type';
import { paginate } from 'src/shared/utils/pagination';
import { UserProfileFactoryService } from './factory/user.ProfileFactory.Service';

@Injectable()
export class UsersService implements IServiceInterface<User, CreateUserDto, UpdateUserDto> {
    constructor(
        @InjectRepository(User) 
        private readonly userRepository: Repository<User>,
        @InjectRepository(Address)
        private readonly addressRepository: Repository<Address>,

        //private readonly vendorsService: VendorsService,
        //private readonly driversService: DriversService,
        //private readonly backofficeService: BackofficeService,
        private readonly userProfileFactoryService: UserProfileFactoryService,
    ) {}

    async findAll(options: {page?: number; limit?: number; [key: string]: any} = {} ): Promise<User[] | PaginatedResult<User>> {
        const relations = ['address'];
        const page = options.page ? Number(options.page) : undefined;
        const limit = options.limit ? Number(options.limit) : undefined;

        if (page && limit) {
            return paginate( this.userRepository, page, limit, { relations })
        }

        return this.userRepository.find({ relations });
    }

    findAddress() : Promise<Address[]> {
        return this.addressRepository.find();
    }

    findOne(id: number): Promise<User | null> {
        return this.userRepository.findOne({
            where: { id: id },
            relations: ['vendorProfile', 'driverProfile', 'backOfficeProfile', 'address', 'orders', 'supportRequest'],
        });
    }

    findClient(clientData: ClientDataDto): Promise<User | null> {
        return this.userRepository.findOne({
            where: { id: clientData.id, role: clientData.role },
            relations: ['address', 'favoriteVendors', 'reviews'],
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

      if (data.address) {
        address = this.addressRepository.create(data.address);
        await this.addressRepository.save(address);
      }

      const emailLower = data.email.toLowerCase();
      const { vendorProfile, driverProfile, backOffice: backOfficeProfile, ...restData } = data;

      const user = this.userRepository.create({
        ...restData,
        email: emailLower,
        address,
      });

      const savedUser = await this.userRepository.save(user);

      // ✅ Creación del perfil usando la fábrica
      let profileData = vendorProfile || driverProfile || backOfficeProfile;
      if (savedUser.role && profileData) {
        const { entity, relationKey } = await this.userProfileFactoryService.createProfile(savedUser, profileData);
        if (entity && relationKey) {
          savedUser[relationKey] = entity;
          savedUser[`${relationKey}Id`] = entity.id;
          await this.userRepository.save(savedUser);
        }
      }

      return savedUser;
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      throw new InternalServerErrorException('Error al crear el usuario.');
    }
  }
        
    /* async create(data: CreateUserDto): Promise<User> {
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
            
            //verificar si se puede refactorizar el siguiente codigo, ya que es repetitivo.
            if (savedUser.role === UserRole.VENDOR && vendorProfile) {
                dto = new CreateVendorDto();
                dto = vendorProfile.VendorDto;
                dto.UserId = savedUser.id;
                console.log('Creando perfil de vendedor con los siguientes datos:', dto);
                savedEntity = await this.vendorsService.create(dto);
    
                savedUser.vendorProfile = savedEntity;
                savedUser.vendorProfileId = savedEntity.id;
                await this.userRepository.save(savedUser);
            }
            else if (savedUser.role === UserRole.DRIVER && driverProfile) {
                //Puede recibir el dto como objeto o un objeto que tenga las mismas caracteristicas
                if ((driverProfile as any).createDriverDto) {
                    dto = (driverProfile as any).createDriverDto as CreateDriverDto;
                } else {
                    dto = Object.assign(new CreateDriverDto(), driverProfile as unknown as Partial<CreateDriverDto>);
                }
                (dto as any).userId = savedUser.id;
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
         */
    }

  
async update(id: number, body: UpdateUserDto): Promise<Partial<User>> {
  try {
    // Desestructuramos los posibles datos de perfiles y el resto del body
    const { driverProfile, vendorProfile, backOffice, ...rest } = body as any;

    // Buscar el usuario con todas sus relaciones relevantes
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['driverProfile', 'vendorProfile', 'backOfficeProfile', 'address'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Aplicar los cambios directos
    Object.assign(user, rest);

    // --- Actualización de dirección ---
    if (rest.addressId) {
      const newAddress = await this.addressRepository.findOne({
        where: { id: rest.addressId },
      });

      if (!newAddress) {
        throw new NotFoundException('Dirección no encontrada');
      }

      user.address = newAddress;
      user.addressId = newAddress.id;
    }

    // --- Actualización del perfil según el rol ---
    const profileData = vendorProfile || driverProfile || backOffice;

    if (profileData) {
      // Validar rol del usuario antes de actualizar perfil
      if (vendorProfile && user.role !== 'VENDOR') {
        throw new Error('El usuario no tiene rol de VENDOR');
      }
      if (driverProfile && user.role !== 'DRIVER') {
        throw new Error('El usuario no tiene rol de DRIVER');
      }
      if (backOffice && user.role !== 'ADMIN') {
        throw new Error('El usuario no tiene rol de ADMIN');
      }

      const { entity, relationKey } = await this.userProfileFactoryService.updateProfile(
        user,
        profileData,
      );

      if (entity && relationKey) {
        (user as any)[relationKey] = entity;
        (user as any)[`${relationKey}Id`] = entity.id;
      }
    }

    // Guardar cambios
    const updatedUser = await this.userRepository.save(user);

    // Retornar el usuario sin la contraseña
    const { password, ...safeUser } = updatedUser;
    return safeUser;
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    throw new InternalServerErrorException('No se pudo actualizar el usuario');
  }
}


    async toggleFavoriteVendor(userId: number, vendorId: number) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['favoriteVendors'],
        });

        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        const vendor = await this.vendorsService.findOne(vendorId);

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
async delete(id: number): Promise<void> {
  const user = await this.userRepository.findOne({
    where: { id },
    relations: ['vendorProfile', 'driverProfile', 'backOfficeProfile'],
  });

  if (!user) {
    throw new NotFoundException('Usuario no encontrado');
  }

  try {
    // Borrar perfiles asociados si existen
    await this.userProfileFactoryService.deleteProfile(user);

    // Borrar el usuario
    await this.userRepository.delete(id);
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw new InternalServerErrorException('Error al eliminar el usuario.');
  }
}

