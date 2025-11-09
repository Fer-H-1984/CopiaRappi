import { Order } from "src/orders/entities/orders/orders.entity";
import { PaymentsMethod } from "src/payments/payments-methods/entities/payments-method.entity";
import { User } from "src/users/entities/user/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";



export enum PaymentStatus {
    PENDING = 'PENDIENTE',
    COMPLETED = 'COMPLETADA',
    FAILED = 'FALLIDA',
    REFUNDED = 'REEMBOLSADA',
}

@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING})
    status: PaymentStatus;

    @CreateDateColumn()
    createdAt: Date;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column({ nullable: true })
    transactionId?: string;

    @ManyToOne(() => PaymentsMethod, paymethod => paymethod.payments)
    method: PaymentsMethod;
    
    @ManyToOne(() => Order, order => order.payments)
    order: Order;

    @Column({nullable:true})
    @JoinColumn({name: 'orderId'})
    OrderId: number;

    @ManyToOne(() => User, user => user.payments)
    user: User;
}
