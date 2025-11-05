import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { User } from 'src/users/entities/user/user.entity';

@Entity()
export class Driver {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  vehicleType: string;

  @Column()
  licensePlate: string;

  @OneToOne(() => User, (user) => user.driverProfile)
  user: User;

  @OneToOne(() => User, (user) => user.id)
  UserId: number;
}

