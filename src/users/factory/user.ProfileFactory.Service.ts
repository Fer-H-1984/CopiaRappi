import { Injectable } from '@nestjs/common';
import { User, UserRole } from '../entities/user/user.entity';
import { VendorsService } from 'src/vendors/vendors.service';
import { DriversService } from 'src/drivers/drivers.service';
import { BackofficeService } from 'src/backoffice/backoffice.service';
import { CreateVendorDto } from 'src/vendors/entities/dto/create-vendor.dto';
import { CreateDriverDto } from 'src/drivers/entities/dto/create-driver.dto';
import { CreateBackofficeDto } from 'src/backoffice/entities/dto/create-backoffice.dto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class UserProfileFactoryService {
  constructor(
    private readonly vendorsService: VendorsService,
    private readonly driversService: DriversService,
    private readonly backofficeService: BackofficeService,
  ) {}

  async createProfile(
    user: User,
    profileData: Record<string, unknown>,
  ): Promise<{ entity: unknown; relationKey: string }> {
    switch (user.role) {
      case UserRole.VENDOR: {
        const dto = Object.assign(new CreateVendorDto(), profileData as Partial<CreateVendorDto>);
        dto.UserId = user.id;
        const entity: unknown = await this.vendorsService.create(dto);
        return { entity, relationKey: 'vendorProfile' };
      }

      case UserRole.DRIVER: {
        const dto = Object.assign(new CreateDriverDto(), profileData);
        (dto as CreateDriverDto).userId = user.id;
        const entity: unknown = await this.driversService.create(dto);
        return { entity, relationKey: 'driverProfile' };
      }

      case UserRole.ADMIN: {
        const dto = Object.assign(new CreateBackofficeDto(), profileData);
        dto.UserId = user.id;
        const entity: unknown = await this.backofficeService.create(dto);
        return { entity, relationKey: 'backOfficeProfile' };
      }

      default:
        return { entity: null, relationKey: '' };
    }
  }

  async updateProfile(
    user: User,
    profileData: CreateVendorDto | CreateDriverDto | CreateBackofficeDto,
  ): Promise<{ entity: unknown; relationKey: string }> {
    switch (user.role) {
      case UserRole.VENDOR: {
        const dto = Object.assign(new CreateVendorDto(), profileData);
        dto.UserId = user.id;

        let entity: unknown;
        if (user.vendorProfileId) {
          await this.vendorsService.update(user.vendorProfileId, dto);
          entity = await this.vendorsService.findOne(user.vendorProfileId);
        } else {
          entity = await this.vendorsService.create(dto);
        }
        return { entity, relationKey: 'vendorProfile' };
      }

      case UserRole.DRIVER: {
        const dto = Object.assign(new CreateDriverDto(), profileData as CreateDriverDto);
        dto.userId = user.id;

        let entity: unknown;
        if (user.driverProfileId) {
          await this.driversService.update(user.driverProfileId, dto);
          entity = await this.driversService.findOne(user.driverProfileId);
        } else {
          entity = await this.driversService.create(dto);
        }
        return { entity, relationKey: 'driverProfile' };
      }

      case UserRole.ADMIN: {
        const dto = Object.assign(new CreateBackofficeDto(), profileData);
        dto.UserId = user.id;

        let entity: unknown;
        if (user.backOfficeProfileId) {
          await this.backofficeService.update(user.backOfficeProfileId, dto);
          entity = await this.backofficeService.findOne(user.backOfficeProfileId);
        } else {
          entity = await this.backofficeService.create(dto);
        }
        return { entity, relationKey: 'backOfficeProfile' };
      }

      default:
        throw new NotFoundException(
          'Rol de usuario no soportado o sin perfil asociado.',
        );
    }
  }

  async deleteProfile(user: User): Promise<void> {
    try {
      if (user.vendorProfileId) {
        await this.vendorsService.delete(user.vendorProfileId);
      }

      if (user.driverProfileId) {
        await this.driversService.delete(user.driverProfileId);
      }

      if (user.backOfficeProfileId) {
        await this.backofficeService.delete(user.backOfficeProfileId);
      }
    } catch (error) {
      console.error('Error al eliminar perfil:', error);
      throw new NotFoundException('Error al eliminar el perfil del usuario.');
    }
  }
}