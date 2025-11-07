import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../../users/entities/user/user.entity';
import { Driver } from './../../../drivers/entities/drivers/driver.entity';
import { Payment } from 'src/payments/payments/entities/payment.entity';

export enum OrderStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}
 

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column('timestamp')
  createdAt: Date;

  @Column({ nullable: true })
  userId: number;

  @ManyToOne(() => User, user => user.id)
  user: User;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @Column('json', { nullable: true })
  items: Array<{
    productId: number;
    quantity: number;
    price: number;
  }>;

  @OneToMany(() => Payment, payment => payment.order)
  payments: Payment[];

  @Column({ nullable: true })
  driverId: number; 

  @ManyToOne(() => Driver, driver => driver.id, { nullable: true })
  driver: Driver; 
}
