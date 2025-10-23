import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Driver } from '../../../drivers/entities/drivers/drivers';
import { Order } from '../../../orders/entities/orders/orders';

@Entity()
export class Delivery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  recipientName: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  driverId: number;

  @ManyToOne(() => Driver, (driver) => driver.deliveries, { nullable: true })
  @JoinColumn({ name: 'driverId' })
  driver: Driver;

  // Relación OneToOne propietaria con FK orderId en delivery
  @OneToOne(() => Order, (order) => order.delivery, { nullable: false })
  @JoinColumn({ name: 'orderId' })
  order: Order;
}
