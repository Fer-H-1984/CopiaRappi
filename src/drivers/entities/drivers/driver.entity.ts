import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { User } from '../../../users/entities/user/user';
import { Order } from '../../../orders/entities/orders/orders';


export enum DriverStatus {
  AVAILABLE = 'DISPONIBLE',     
  BUSY = 'EN ENTRGA',               
  OFFLINE = 'NO DISPONIBLE'          
}


export enum VehicleType {
  MOTORCYCLE = 'MOTO',   
  BICYCLE = 'BICI',         
  CAR = 'AUTO',                 
  SCOOTER = 'SCOOTER ELECTRICA'         
}


@Entity('drivers') 
export class Driver {
   
  // CAMPOS IDENTIFICADORES
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: number;

  @OneToOne(() => User, (user) => user.driverProfile, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  // INFORMACIÓN PERSONAL
  
  
  @Column({ length: 100 })
  name: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ nullable: true })
  photo: string; 

  // 🚗 INFORMACIÓN DEL VEHÍCULO
  
  @Column({
    type: 'enum',
    enum: VehicleType,
    default: VehicleType.MOTORCYCLE
  })
  vehicleType: VehicleType;

  @Column({ length: 20, nullable: true })
  licensePlate: string; 

  @Column({ length: 50, nullable: true })
  vehicleBrand: string; 

  @Column({ length: 50, nullable: true })
  vehicleModel: string; 

  @Column({ nullable: true })
  vehicleYear: number; 

  // DOCUMENTACIÓN
  
  @Column({ length: 30, nullable: true })
  driverLicense: string; 

  @Column({ type: 'date', nullable: true })
  licenseExpiryDate: Date; 

  @Column({ default: false })
  documentsVerified: boolean; 

  @Column({ nullable: true })
  insurancePolicy: string; 

  // ESTADO Y DISPONIBILIDAD
  
  @Column({
    type: 'enum',
    enum: DriverStatus,
    default: DriverStatus.OFFLINE
  })
  status: DriverStatus;

  @Column({ default: true })
  isActive: boolean; 

  
  //  UBICACIÓN (PARA TAREA 4)//
   
  
  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  currentLatitude: number; 

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  currentLongitude: number; 

  @Column({ type: 'timestamp', nullable: true })
  lastLocationUpdate: Date; 

  // ESTADÍSTICAS Y CALIFICACIÓN//
  
  @Column({ type: 'decimal', precision: 3, scale: 2, default: 5.0 })
  rating: number; 

  @Column({ default: 0 })
  totalDeliveries: number; 

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalEarnings: number; 

  
  // RELACIONES//
  
  
  @OneToMany(() => Order, (order) => order.driver)
  orders: Order[]; // Pedidos asignados a este driver

  
  @CreateDateColumn()
  createdAt: Date; 

  @UpdateDateColumn()
  updatedAt: Date; 
}