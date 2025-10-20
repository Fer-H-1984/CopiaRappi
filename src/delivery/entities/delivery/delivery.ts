import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Driver } from '../../../drivers/entities/drivers/drivers';  // ajusta la ruta según tu estructura

@Entity('delivery')
export class Delivery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  recipientName: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column({ default: 'pending' }) // ejemplo: pending, dispatched, delivered
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Driver, driver => driver.deliveries)
  driver: Driver;
}
