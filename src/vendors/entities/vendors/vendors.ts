import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToOne } from 'typeorm';
import { User } from 'src/users/entities/user/user';

@Entity()
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => User, (user) => user.favoriteVendors)
  favoritedBy: User[];

  @OneToOne(() => User, (user) => user.vendorProfile)
  user: User;
}
