import { Payment } from "src/payments/payments/entities/payment.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


export enum PaymentsMethodType{
    EFECTIVO = 'EFECTIVO',
    TRANSFERENCIA = 'TRANSFERENCIA',
    TARJETA = 'TARJETA',
    BILLETERA_VIRTUAL = 'BILLETERA VIRTUAL'
}

@Entity()
export class PaymentsMethod {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type:'enum', enum:PaymentsMethodType })
    type: PaymentsMethodType;

    @Column()
    name: string;

    @Column({default: true})
    isActive: boolean;

    //Relaciones
    @OneToMany(() => Payment, payment => payment)
    payments: Payment[];
}
