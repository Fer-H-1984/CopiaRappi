import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToMany } from 'typeorm';
import { Vendor } from '../../../vendors/entities/vendors/vendors.entity';
import { Category } from './category.entity';
import { OrderItem } from 'src/orders/entities/orders/order-item.entity';



@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ nullable: true })
  imageUrl?: string;

  @ManyToOne(() => Category, (category) => category.products, { eager: true })
  @JoinColumn({ name: 'category'})
  category: Category;

  @ManyToOne(() => Vendor, (vendor) => vendor.products, { eager: true })
  vendor: Vendor;
 

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItem: OrderItem;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

