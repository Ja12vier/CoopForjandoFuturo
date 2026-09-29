import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class FinancialStatistics {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('decimal')
  totalCapital!: number;

  @Column('decimal')
  totalLoan!: number;

  @Column('decimal')
  totalBorrowed!: number;

  @Column('decimal')
  currentLoans!: number;

  @Column('decimal')
  paidLoans!: number;

  @Column('decimal')
  totalSavings!: number;

  @Column('decimal')
  totalIncome!: number;

  @Column('decimal')
  totalExpenses!: number;

  @Column('decimal')
  totalUserClient!: number;

  @Column('decimal')
  utilidadNeta!: number;

  @Column('int')
  month!: number;

  @Column('int')
  year!: number;

  @Column('decimal')
  booking!: number;

  @Column('bigint')
  interestEarnings!: number;
}
