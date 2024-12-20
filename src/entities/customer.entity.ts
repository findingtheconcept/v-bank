import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'decimal', default: 0 })
  debitBalance: number;

  @Column({ type: 'decimal', default: 0 })
  creditBalance: number;
}
