import { User } from "src/users/entities/user/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum SupportCategory {
    ORDER = 'ORDER',
    PAYMENT = 'PAYMENT',
    ACCOUNT = 'ACCOUNT',
    OTHER = 'OTHER',
}

export enum SupportStatus{
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    RESOLVED = 'RESOLVED',
}

@Entity()
export class Support {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({type:'enum', enum: SupportCategory})
    supportCategory: SupportCategory;

    @Column({ nullable: true })
    adminComment?: string;
    
    @Column({ type: 'enum', enum: SupportStatus, default: SupportStatus.PENDING })
    status: SupportStatus;

    @ManyToOne(() => User, (user) => user.supportRequest)
    user: User;

    @Column({nullable: true})
    userId: number;

    @ManyToOne(() => User, (user) => user , { nullable: true } )
    targetUser?: User;

}
