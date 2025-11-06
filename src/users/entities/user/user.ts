import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Address } from './address';
import { Driver } from 'src/drivers/entities/drivers/driver.entity';


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

   @Column({ nullable: true })
  driverProfileId?: number;

  @OneToOne(() => Driver, (driver) => driver.user, { nullable: true })
  @JoinColumn({ name: 'driverProfileId' }) // ⭐ Importante
  driverProfile?: Driver;
}
