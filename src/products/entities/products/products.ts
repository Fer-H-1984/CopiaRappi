import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Vendor } from '../../../vendors/entities/vendors/vendors';
import { Decimal } from 'decimal.js';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal')
  price: Decimal;

  @Column()
  description: string;

  @ManyToOne(() => Vendor)
  vendor: Vendor;
}

