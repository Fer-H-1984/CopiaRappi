import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Address } from './address';
import { Order } from './../../../orders/entities/orders/orders';
import { Vendor } from 'src/vendors/entities/vendors/vendors';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  addressId: number;

  @ManyToOne(() => Address, (address) => address.street , {eager: true})
  @JoinColumn({ name: 'addressId' })
  address: Address;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @ManyToMany(() => Vendor, (vendor) => vendor.favoritedBy, {cascade: false, eager: false})
  @JoinTable({
    name: 'user_favorite_vendors',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'vendorId', referencedColumnName: 'id' },
  })
  favoriteVendors: Vendor[];
}
