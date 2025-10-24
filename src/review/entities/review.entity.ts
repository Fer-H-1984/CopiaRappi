/* import { User } from "src/users/entities/user/user";
import { Vendor } from "src/vendors/entities/vendors/vendors"; */
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    rating: number;

    @Column()
    comment: string;

    @Column()
    createdAt: Date;

    /* ClientId: number;

    VendorId: number; */
}
