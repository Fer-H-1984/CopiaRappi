import { User } from "src/users/entities/user/user.entity";
import { Vendor } from "src/vendors/entities/vendors/vendors.entity"; 
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    rating: number;

    @Column({nullable: true})
    comment: string;

    @Column()
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.id, {eager: true})
    user: User;

    @ManyToOne(() => Vendor, (vendor) => vendor.id, {eager: true})
    vendor: Vendor; 
}
