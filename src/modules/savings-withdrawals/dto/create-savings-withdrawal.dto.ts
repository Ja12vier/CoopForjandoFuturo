import { IsNumber, IsString, IsOptional, IsDate, IsEnum, IsNotEmpty } from 'class-validator';


export enum TypeSavingsWithdrawal{
  SAVINGS='Savings',
  WITHDRAWAL='Withdrawal',
}


export enum PaymentMethod{
  CASH='Cash',
  TRANSFER='Transfer',
  DEPOSIT='Deposit',
  CHECK='Check'
}
//'SAVINGS' | 'RETIREMENT' | 'CHRISTMAS' | 'FAMILY' | 'FIXED_TERM'
export class CreateSavingsWithdrawalDto {
  @IsNumber()
  @IsOptional()
  numberAccount?: string;

  @IsNumber()
  amount!: number;

  @IsString()
  @IsEnum(TypeSavingsWithdrawal)
  type!: string;

  @IsOptional()
  @IsString()
  description?: string;


  @IsString()
  @IsEnum(PaymentMethod)
  paidMethod: string=PaymentMethod.CASH;

  @IsNotEmpty()
  date!: Date;

  @IsNumber()
  userClientId!: number;

  @IsNumber()
  userId!: number;

}