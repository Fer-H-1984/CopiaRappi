import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user';

@Entity()
export class Address {
    @PrimaryGeneratedColumn()
     id: number;

    @Column()
    street: string;

    @OneToMany(() => User, (user) => user.address)
    users: User[];
}