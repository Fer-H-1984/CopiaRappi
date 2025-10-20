import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
//import { Delivery } from '../../../deliveries/entities/delivery'; // si creaste el módulo deliveries

@Entity('drivers')
export class Driver {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column()
  passwordHash: string;

  @Column({ default: 'inactive' }) // Puedes cambiar a boolean si lo prefieres
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  //@OneToMany(() => Delivery, delivery => delivery.driver)
  //deliveries: Delivery[];
}
