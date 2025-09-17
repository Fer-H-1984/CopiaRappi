import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Driver {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  vehicleType: string;

  @Column()
  phone: string;

  @Column({ default: true })
  isAvailable: boolean;
}

