import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToOne, OneToMany } from 'typeorm';
import { User } from 'src/users/entities/user/user.entity';
import { Review } from 'src/review/entities/review.entity';
import { Order } from 'src/orders/entities/orders/orders.entity';

@Entity()
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: 'sin nombre'})
  shopName: string;

  @ManyToMany(() => User, (user) => user.favoriteVendors)
  favoritedBy: User[];

  @OneToOne(() => User, (user) => user.vendorProfile)
  user: User;

  @OneToOne(() => User, (user) => user.id)
  UserId: number;

  @OneToMany(() => Review, (review) => review.Vendor)
  reviews: Review[];

  @OneToMany(() => Order, (order) => order.vendor)
  orders: Order[];
}
