import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinTable } from 'typeorm';
import { User } from '../../../users/entities/user/user.entity';
import { Driver } from './../../../drivers/entities/drivers/driver.entity';
import { Payment } from 'src/payments/payments/entities/payment.entity';
import { OrderItem } from './order-item.entity';
import { Vendor } from 'src/vendors/entities/vendors/vendors.entity';

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

  @ManyToOne(() => User, user => user.orders)
  user: User;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ nullable: true })
  trackingNumber: string;

  @OneToMany(() => Payment, payment => payment.order)
  payments: Payment[];

  @Column({ nullable: true })
  driverId: number; 

  @ManyToOne(() => Driver, driver => driver.id, { nullable: true })
  driver: Driver; 

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true, eager: true })
  @JoinTable({name: 'list_of_products', joinColumn: {name: 'orderId', referencedColumnName: 'id'}, inverseJoinColumn: {name: 'productId', referencedColumnName: 'id'}})
  items: OrderItem[];

  @ManyToOne(() => Vendor, (vendor) => vendor.orders)
  vendor: Vendor;

  @Column({ nullable: true })
  vendorId?: number
}
