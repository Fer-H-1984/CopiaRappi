import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable, OneToOne } from 'typeorm';
import { Address } from './address';
import { Order } from './../../../orders/entities/orders/orders';
import { Vendor } from 'src/vendors/entities/vendors/vendors';
import { Driver } from 'src/drivers/entities/drivers/drivers';
import { Admin } from 'src/backoffice/entities/backoffice/backoffice';

export enum UserRole{
  ADMIN='ADMIN',
  VENDOR='VENDOR',
  CLIENT='CLIENT',
  DRIVER='DRIVER'
}

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

  @Column({
    type:'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role: 'CLIENT' | 'VENDOR' | 'DRIVER' | 'ADMIN';

  @Column({ nullable: true })
  vendorProfileId?: number

  @OneToOne(() => Vendor, (vendor) => vendor.user, {nullable: true} )
  @JoinColumn({name: 'vendorProfile'})
  vendorProfile?: Vendor

  @Column({ nullable: true })
  driverProfileId?: number

  @OneToOne(() => Driver, (driver) => driver.user, {nullable:true})
  @JoinColumn({name: 'driverProfile'})
  driverProfile?: Driver

  @Column({ nullable: true })
  backOfficeProfileId?: number

  @OneToOne(()=> Admin, (admin) => admin.user, {nullable:true})
  @JoinColumn({name: 'backOfficeProfile'})
  backOfficeProfile?: Admin
}
