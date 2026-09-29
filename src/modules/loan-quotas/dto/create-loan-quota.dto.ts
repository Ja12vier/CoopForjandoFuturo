import { Type } from 'class-transformer';
import { IsNumber, IsString, IsOptional, IsDate, IsDateString, IsBoolean, IsEnum } from 'class-validator';
import { StateLoan } from 'src/modules/loans/dto/create-loan.dto';
import { Payment } from 'src/modules/loans/dto/create-loan.dto';
import { PaymentMethod } from 'src/modules/savings-withdrawals/dto/create-savings-withdrawal.dto';
import { ExcesPaymentAction, PaymentTipe } from '../entities/loan-quota.entity';


export class CreateLoanQuotaDto {

  @IsNumber()
  numberQuota!: number;

  @IsNumber()
  amountQuota!: number;

  @IsNumber()
  interestQuota!: number;

  @IsNumber()
  capitalQuota!: number;

  @IsNumber()
  @IsOptional()
  penaltyAmount?: number; 

  @IsNumber()
  @IsOptional()
  penaltyCount?: number;  // cantidad de penalidades aplicadas

  @IsOptional()
  @IsString()
  methodPayment?:string=PaymentMethod.CASH;  
  
  @IsNumber()
  @IsOptional()
  debtQuota?:number;

  @Type(() => Date)  //fecha que toca pagar
  datePay!: Date;
  
  @Type(() => Date)//fecha que se pago
  @IsOptional()
  paidDate?: Date;

  @Type(()=> Date)
  @IsOptional()
  Z?: Date;
  
  @IsNumber()
  @IsOptional() // dia de retrazo
  daysLate?:number
  
  @IsBoolean() //true si el prestamo esta vencido
  isOverdue: boolean=false;
  
  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethods?:string=PaymentMethod.CASH;
 
  @IsOptional()
  @IsEnum(StateLoan)
  status?: string=StateLoan.PENDING;

  @IsEnum(Payment)
  @IsOptional()
  payment?:String=PaymentTipe.MONTHLY;

  @IsNumber()
  @IsOptional()
  installmentPayment?: number;

  @IsString()
  @IsOptional()
  action?: string= undefined;

  @IsNumber()
  loanId!: number;
}
