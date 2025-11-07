import { 
  Injectable, 
  NotFoundException, 
  BadRequestException,
  InternalServerErrorException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver, DriverStatus } from './entities/drivers/driver.entity';
import { CreateDriverDto } from './entities/dto/create-driver.dto';
import { UpdateDriverDto } from './entities/dto/update-driver.dto';
import { UpdateDriverLocationDto } from './entities/dto/update-driver-location.dto';


@Injectable()
export class DriversService {
  
  constructor(
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
  ) {}

  
  /**
   * @param page - Número de página (por defecto 1)
   * @param limit - Cantidad de resultados por página (por defecto 10)
   * @param status - Filtro opcional por estado (AVAILABLE, BUSY, OFFLINE)
   * @param isActive - Filtro opcional por drivers activos/inactivos
   * 
   * @returns Array de drivers y total de registros
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    status?: DriverStatus,
    isActive?: boolean
  ): Promise<{ data: Driver[]; total: number; page: number; lastPage: number }> {
    try {
      // Construimos la query con filtros dinámicos
      const queryBuilder = this.driverRepository.createQueryBuilder('driver');

      // Filtro por estado (opcional)
      if (status) {
        queryBuilder.andWhere('driver.status = :status', { status });
      }

   
      if (isActive !== undefined) {
        queryBuilder.andWhere('driver.isActive = :isActive', { isActive });
      }

      // Paginación
      queryBuilder
        .skip((page - 1) * limit) // Calcular offset
        .take(limit) // Cantidad de registros
        .orderBy('driver.createdAt', 'DESC'); // Ordenar por más reciente

      const [data, total] = await queryBuilder.getManyAndCount();

      return {
        data,
        total,
        page,
        lastPage: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los drivers');
    }
  }

  /** 
   * @param id - ID del driver a buscar
   * @returns Driver encontrado
   * @throws NotFoundException si no existe
   */
  async findOne(id: number): Promise<Driver> {
    const driver = await this.driverRepository.findOne({
      where: { id },
      relations: ['user', 'orders'], 
    });

    if (!driver) {
      throw new NotFoundException(`Driver con ID ${id} no encontrado`);
    }

    return driver;
  }

  /**
   * @param createDriverDto - Datos del driver a crear
   * @returns Driver creado
   */
  async create(createDriverDto: CreateDriverDto): Promise<Driver> {
    try {
      if (createDriverDto.licensePlate) {
        const existingDriver = await this.driverRepository.findOne({
          where: { licensePlate: createDriverDto.licensePlate },
        });

        if (existingDriver) {
          throw new BadRequestException(
            `Ya existe un driver con la patente ${createDriverDto.licensePlate}`
          );
        }
      }

      // Crear instancia del driver
      const driver = this.driverRepository.create({
        ...createDriverDto,
        status: DriverStatus.OFFLINE, // Por defecto comienza OFFLINE
        documentsVerified: false, // Debe ser verificado por admin
        isActive: true, // Activo por defecto
        rating: 5.0, // Rating inicial perfecto
        totalDeliveries: 0,
        totalEarnings: 0,
      });

      // Guardar en la base de datos
      const savedDriver = await this.driverRepository.save(driver);

      return savedDriver;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al crear el driver');
    }
  }
  
  /**
   * @param id - ID del driver a actualizar
   * @param updateDriverDto - Datos a actualizar
   * @returns Driver actualizado
   */
  async update(id: number, updateDriverDto: UpdateDriverDto): Promise<Driver> {
    try {
      // Verificar que existe
      const driver = await this.findOne(id);

      // Si se actualiza la patente, validar que no esté en uso por otro driver
      if (updateDriverDto.licensePlate && updateDriverDto.licensePlate !== driver.licensePlate) {
        const existingDriver = await this.driverRepository.findOne({
          where: { licensePlate: updateDriverDto.licensePlate },
        });

        if (existingDriver) {
          throw new BadRequestException(
            `La patente ${updateDriverDto.licensePlate} ya está en uso`
          );
        }
      }

      //  Actualizar campos
      Object.assign(driver, updateDriverDto);

      const updatedDriver = await this.driverRepository.save(driver);

      return updatedDriver;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al actualizar el driver');
    }
  }

  /** 
   * @param id - ID del driver
   * @param status - Nuevo estado
   * @returns Driver actualizado
   */
  async updateStatus(id: number, status: DriverStatus): Promise<Driver> {
    const driver = await this.findOne(id);
    driver.status = status;
    return await this.driverRepository.save(driver);
  }

  /**
   * @param id - ID del driver
   * @param isActive - true para activar, false para desactivar
   * @returns Driver actualizado
   */
  async toggleActive(id: number, isActive: boolean): Promise<Driver> {
    const driver = await this.findOne(id);
    driver.isActive = isActive;
    
    if (!isActive) {
      driver.status = DriverStatus.OFFLINE;
    }
    
    return await this.driverRepository.save(driver);
  }

  
  /** 
   * @param id - ID del driver
   * @returns Driver actualizado
   */
  async verifyDocuments(id: number): Promise<Driver> {
    const driver = await this.findOne(id);
    driver.documentsVerified = true;
    return await this.driverRepository.save(driver);
  }

  /**
   * @param id - ID del driver
   * @param locationDto - Latitud y longitud
   * @returns Driver actualizado
   */
  async updateLocation(
    id: number, 
    locationDto: UpdateDriverLocationDto
  ): Promise<Driver> {
    const driver = await this.findOne(id);
    
    driver.currentLatitude = locationDto.latitude;
    driver.currentLongitude = locationDto.longitude;
    driver.lastLocationUpdate = new Date();
    
    return await this.driverRepository.save(driver);
  }

  /**
   * @param latitude - Latitud del punto de origen
   * @param longitude - Longitud del punto de origen
   * @param radiusKm - Radio de búsqueda en kilómetros
   * @returns Array de drivers cercanos y disponibles
   */
  async findNearbyAvailable(
    latitude: number,
    longitude: number,
    radiusKm: number = 5
  ): Promise<Driver[]> {
    //  Fórmula de Haversine en SQL para calcular distancia
    const drivers = await this.driverRepository
      .createQueryBuilder('driver')
      .where('driver.status = :status', { status: DriverStatus.AVAILABLE })
      .andWhere('driver.isActive = :isActive', { isActive: true })
      .andWhere('driver.documentsVerified = :verified', { verified: true })
      .andWhere('driver.currentLatitude IS NOT NULL')
      .andWhere('driver.currentLongitude IS NOT NULL')
      .andWhere(
        `(
          6371 * acos(
            cos(radians(:lat)) * 
            cos(radians(driver.currentLatitude)) * 
            cos(radians(driver.currentLongitude) - radians(:lng)) + 
            sin(radians(:lat)) * 
            sin(radians(driver.currentLatitude))
          )
        ) <= :radius`,
        { lat: latitude, lng: longitude, radius: radiusKm }
      )
      .orderBy('driver.rating', 'DESC') // Ordenar por mejor rating
      .getMany();

    return drivers;
  }

  
  /**
   * @param id - ID del driver
   * @returns Objeto con estadísticas
   */
  async getStatistics(id: number) {
    const driver = await this.findOne(id);
    
    return {
      id: driver.id,
      rating: driver.rating,
      totalDeliveries: driver.totalDeliveries,
      totalEarnings: driver.totalEarnings,
      status: driver.status,
      isActive: driver.isActive,
      documentsVerified: driver.documentsVerified,
      vehicleInfo: {
        type: driver.vehicleType,
        plate: driver.licensePlate,
        brand: driver.vehicleBrand,
        model: driver.vehicleModel,
        year: driver.vehicleYear,
      },
    };
  }

  /**
   * Elimina un driver de la base de datos 
   * @param id - ID del driver a eliminar
   */
  async delete(id: number): Promise<void> {
    const driver = await this.findOne(id);
    await this.driverRepository.remove(driver);
  }

  /**
   * @param id - ID del driver
   */
  async softRemove(id: number): Promise<Driver> {
    return await this.toggleActive(id, false);
  }
}
