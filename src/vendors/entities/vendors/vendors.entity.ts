import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from 'src/users/entities/user/user.entity';
import { Review } from 'src/review/entities/review.entity';
import { Product } from 'src/products/entities/products/products.entity';

@Entity()
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'sin nombre' })
  shopName: string;

  @ManyToMany(() => User, (user) => user.favoriteVendors)
  favoritedBy: User[];

  @OneToOne(() => User, (user) => user.vendorProfile)
  user: User;

  @OneToMany(() => Review, (review) => review.Vendor)
  reviews: Review[];

  @OneToMany(() => Product, (product) => product.vendor)
  products: Product[];
}
