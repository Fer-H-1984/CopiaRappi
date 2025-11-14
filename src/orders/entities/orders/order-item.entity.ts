import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Product } from "src/products/entities/products/products.entity";
import { Order } from "./orders.entity";

@Entity()
export class OrderItem{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
    order: Order;

    @ManyToOne(() => Product, (product) => product.orderItem, { eager: true })
    product: Product;

    @Column({ nullable: true})
    productId: number

    @Column()
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    subtotal: number;
}