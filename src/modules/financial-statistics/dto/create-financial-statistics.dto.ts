import { IsNumber } from 'class-validator';

export class CreateFinancialStatisticsDto {
  @IsNumber()
  totalCapital!: number;

  @IsNumber()
  totalLoan!: number;

  @IsNumber()
  totalBorrowed!: number;

  @IsNumber()
  currentLoans!: number;

  @IsNumber()
  paidLoans!: number;

  @IsNumber()
  totalSavings!: number;

  @IsNumber()
  totalIncome!: number;

  @IsNumber()
  totalExpenses!: number;

  @IsNumber()
  totalUserClient!: number;

  @IsNumber()
  utilidadNeta!: number;

  @IsNumber()
  month!: number;

  @IsNumber()
  year!: number;

  @IsNumber()
  booking!: number;

  @IsNumber()
  interestEarnings!: number;
}
