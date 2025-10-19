import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('drivers')
export class Driver {
  @PrimaryGeneratedColumn()
  id: number;


  @Column()
  name: string;

  @Column({ unique: true})
  email: string;

  @Column()
  phone: string;

  @Column()
  passwordHash: string;

  @Column({ default: 'inactive'})
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  
}

