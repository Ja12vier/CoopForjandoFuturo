import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Income {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('decimal')
  amount!: number;

  @Column()
  description!: string;

  @Column({ nullable: true })
  category!: string;

  @Column({ type: 'date' })
  date!: Date;

  @Column('bigint')
  userId!: number;

  @Column({ type: 'date' })
  period!: Date;
}
