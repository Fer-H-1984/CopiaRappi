import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { User } from 'src/users/entities/user/user.entity';

@Entity()
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToOne(() => User, (user) => user.backOfficeProfile)
  user: User;

  @OneToOne(() => User, (user) => user.id)
  userId: number;
}

