import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from 'src/users/entities/user/user.entity';
import { Review } from 'src/review/entities/review.entity';
import { Product } from 'src/products/entities/products/products.entity';
import { Order } from 'src/orders/entities/orders/orders.entity';

@Entity()
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: 'Sin nombre'})
  shopName: string;

  @ManyToMany(() => User, (user) => user.favoriteVendors)
  favoritedBy: User[];

  @OneToOne(() => User, (user) => user.vendorProfile)
  user: User;

  @OneToOne(() => User, (user) => user.id)
  UserId: number;

  @OneToMany(() => Review, (review) => review.vendor)
  reviews: Review[];

  @OneToMany(() => Product, (product) => product.vendor)
  product: Product[];

  @OneToMany(() => Order, (order) => order.vendor)
  @JoinColumn({ name: 'orders' })
  order: Order[];
}
