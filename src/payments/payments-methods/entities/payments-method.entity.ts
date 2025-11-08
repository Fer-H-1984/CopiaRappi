import { Payment } from "src/payments/payments/entities/payment.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PaymentsMethod {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ default: true })
    isActive: boolean;

    @OneToMany(() => Payment, payment => payment)
    payments: Payment[];
}
