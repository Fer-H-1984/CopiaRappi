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
import * as bcrypt from 'bcryptjs';
import { PaginatedResult } from 'src/shared/interfaces/paginatedResult.type';
import { paginate } from 'src/shared/utils/pagination';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './entities/dto/user-response.dto';

@Injectable()
export class UsersService implements IServiceInterface<User, CreateUserDto, UpdateUserDto, UserResponseDto> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    private readonly vendorsService: VendorsService,
    private readonly driversService: DriversService,
    private readonly backofficeService: BackofficeService,
  ) {}

  async findAll(options: { page?: number; limit?: number; [key: string]: any } = {}): Promise<User[] | PaginatedResult<User>> {
    const relations = ['address'];
    const page = options.page ? Number(options.page) : undefined;
    const limit = options.limit ? Number(options.limit) : undefined;

    if (page && limit) {
      return paginate(this.userRepository, page, limit, { relations });
    }

    return this.userRepository.find({ relations });
  }

  findAddress(): Promise<Address[]> {
    return this.addressRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
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
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }

  // 🚀 Método create actualizado
  async create(data: CreateUserDto): Promise<UserResponseDto> {
    try {
      let address: Address | undefined;
      const emailLower = data.email.toLowerCase();

      if (data.address) {
        address = this.addressRepository.create(data.address);
        await this.addressRepository.save(address);
      }

      const { vendorProfile, backOffice: backOfficeProfile, driverProfile, password, ...restData } = data;
      const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

      const user = this.userRepository.create({
        ...restData,
        email: emailLower,
        password: hashedPassword,
        address,
      });

      const savedUser = await this.userRepository.save(user);

      // 🔹 Crear perfiles según el rol
      if (savedUser.role === UserRole.VENDOR) {
        let dto: CreateVendorDto;

        if (vendorProfile && (vendorProfile as any).VendorDto) {
          dto = (vendorProfile as any).VendorDto as CreateVendorDto;
        } else if (vendorProfile) {
          dto = Object.assign(new CreateVendorDto(), vendorProfile as unknown as Partial<CreateVendorDto>);
        } else {
          dto = new CreateVendorDto();
        }

        dto.UserId = savedUser.id;

        // ✅ Aseguramos valor por defecto para shopName
        if (!dto.shopName || dto.shopName.trim() === '') {
          dto.shopName = 'Sin nombre';
        }

        const savedEntity = await this.vendorsService.create(dto);
        savedUser.vendorProfile = savedEntity;
        savedUser.vendorProfileId = savedEntity.id;
        await this.userRepository.save(savedUser);
      }

      else if (savedUser.role === UserRole.DRIVER) {
        let dto: CreateDriverDto;

        if (driverProfile && (driverProfile as any).createDriverDto) {
          dto = (driverProfile as any).createDriverDto as CreateDriverDto;
        } else if (driverProfile) {
          dto = Object.assign(new CreateDriverDto(), driverProfile as unknown as Partial<CreateDriverDto>);
        } else {
          dto = new CreateDriverDto();
        }

        (dto as any).userId = savedUser.id;

        const savedEntity = await this.driversService.create(dto);
        savedUser.driverProfile = savedEntity;
        savedUser.driverProfileId = savedEntity.id;
        await this.userRepository.save(savedUser);
      }

      else if (savedUser.role === UserRole.ADMIN) {
        if (backOfficeProfile) {
          const dto = Object.assign(new CreateBackofficeDto(), backOfficeProfile as unknown as Partial<CreateBackofficeDto>);
          dto.UserId = savedUser.id;
          const savedEntity = await this.backofficeService.create(dto);

          savedUser.backOfficeProfile = savedEntity;
          savedUser.backOfficeProfileId = savedEntity.id;
          await this.userRepository.save(savedUser);
        }
      }

      return plainToInstance(UserResponseDto, savedUser, { excludeExtraneousValues: true });

    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error al crear el usuario:', error.message);
      } else {
        console.error('Error desconocido al crear el usuario:', error);
      }

      throw new InternalServerErrorException('Error al crear el usuario. Por favor, inténtalo de nuevo más tarde.');
    }
  }

  async update(id: number, body: UpdateUserDto): Promise<User> {
    const { driverProfile, vendorProfile, backOffice, ...rest } = body as any;

    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['driverProfile', 'vendorProfile', 'backOfficeProfile', 'address'],
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    Object.assign(user, rest);

    if (rest.addressId) {
      const newAddress = await this.addressRepository.findOne({ where: { id: rest.addressId } });
      if (!newAddress) throw new NotFoundException('Dirección no encontrada');
      user.address = newAddress;
      user.addressId = newAddress.id;
    }

    if (vendorProfile) {
      let dtoV: CreateVendorDto;
      if ((vendorProfile as any).createVendorDto) {
        dtoV = (vendorProfile as any).createVendorDto as CreateVendorDto;
      } else {
        dtoV = Object.assign(new CreateVendorDto(), vendorProfile as unknown as Partial<CreateVendorDto>);
      }
      dtoV.UserId = user.id;

      if (user.vendorProfileId) {
        await this.vendorsService.update(user.vendorProfileId, dtoV);
        user.vendorProfile = await this.vendorsService.findOne(user.vendorProfileId);
      } else {
        const createdV = await this.vendorsService.create(dtoV);
        user.vendorProfile = createdV;
        user.vendorProfileId = createdV.id;
      }
    }

    if (driverProfile) {
      let dtoD: CreateDriverDto = Object.assign(new CreateDriverDto(), driverProfile as unknown as Partial<CreateDriverDto>);
      (dtoD as any).userId = user.id;
      if (user.driverProfileId) {
        await this.driversService.update(user.driverProfileId, dtoD);
        user.driverProfile = await this.driversService.findOne(user.driverProfileId);
      } else {
        const createdD = await this.driversService.create(dtoD);
        user.driverProfile = createdD;
        user.driverProfileId = createdD.id;
      }
    }

    if (backOffice) {
      let dtoB: CreateBackofficeDto = Object.assign(new CreateBackofficeDto(), backOffice as unknown as Partial<CreateBackofficeDto>);
      dtoB.UserId = user.id;
      if (user.backOfficeProfileId) {
        await this.backofficeService.update(user.backOfficeProfileId, dtoB);
        user.backOfficeProfile = await this.backofficeService.findOne(user.backOfficeProfileId);
      } else {
        const createdB = await this.backofficeService.create(dtoB);
        user.backOfficeProfile = createdB;
        user.backOfficeProfileId = createdB.id;
      }
    }

    await this.userRepository.save(user);
    return user;
  }

  async toggleFavoriteVendor(userId: number, vendorId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favoriteVendors'],
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    const vendor = await this.vendorsService.findOne(vendorId);
    if (!vendor) throw new NotFoundException('Restaurante no encontrado');

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
