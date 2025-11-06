import { Exclude, Expose } from 'class-transformer';
import { DriverStatus, VehicleType } from '../drivers/driver.entity';

/**
 * 📤 DTO PARA RESPUESTAS DE LA API
 * 
 * Define qué campos se devuelven al cliente.
 * Podemos excluir campos sensibles o agregar campos calculados.
 */
export class DriverResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  phone: string;

  @Expose()
  photo: string;

  @Expose()
  vehicleType: VehicleType;

  @Expose()
  licensePlate: string;

  @Expose()
  vehicleBrand: string;

  @Expose()
  vehicleModel: string;

  @Expose()
  vehicleYear: number;

  @Expose()
  status: DriverStatus;

  @Expose()
  isActive: boolean;

  @Expose()
  documentsVerified: boolean;

  @Expose()
  rating: number;

  @Expose()
  totalDeliveries: number;

  @Expose()
  totalEarnings: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  // 🔒 CAMPOS SENSIBLES QUE NO SE DEVUELVEN
  @Exclude()
  driverLicense: string;

  @Exclude()
  insurancePolicy: string;

  // 📍 Ubicación (solo para backoffice/admin)
  @Expose()
  currentLatitude?: number;

  @Expose()
  currentLongitude?: number;

  @Expose()
  lastLocationUpdate?: Date;
}