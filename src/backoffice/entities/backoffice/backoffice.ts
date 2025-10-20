import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Backoffice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  passwordHash: string;

  @Column({ default: true })
  isActive: boolean;
}
