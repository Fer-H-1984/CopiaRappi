import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './../../../users/entities/user/user';
import { Driver } from './../../../drivers/entities/drivers/drivers';
 

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: string;

  @Column('timestamp')
  createdAt: Date;

  @Column({ nullable: true })
  userId: number;

  @ManyToOne(() => User, user => user.id)
  user: User;

  @Column({ nullable: true })  //cambiar a number si se cambia en la db
  driverId: string; 

  @ManyToOne(() => Driver, driver => driver.id, { nullable: true })
  driver: Driver; 
}
