import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Vendor } from '../../../vendors/entities/vendors/vendors';


@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @Column()
  description: string;

  @ManyToOne(() => Vendor)
  vendor: Vendor;
}

