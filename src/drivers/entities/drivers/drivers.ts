import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { User } from 'src/users/entities/user/user';

@Entity()
export class Driver {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  passwordHash: string;

  @Column({ default: true })
  status: string;

  @OneToOne(() => User, (user) => user.driverProfile)
  user: User;
}

