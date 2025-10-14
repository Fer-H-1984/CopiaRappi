import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('drivers')
export class Driver {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @BeforeInsert()
  async hashPassword() {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  }
}

