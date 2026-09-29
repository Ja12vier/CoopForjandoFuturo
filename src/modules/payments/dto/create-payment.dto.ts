import { IsNumber, IsString, IsOptional, IsDate } from 'class-validator';
import { Payment } from '../entities/payment.entity';
import { PaymentMethod } from 'src/modules/savings-withdrawals/dto/create-savings-withdrawal.dto';
import { Type } from 'class-transformer';
import { StateLoan } from 'src/modules/loans/dto/create-loan.dto';

export enum SourcePayment{
  FROM_OVERPAYMENT = 'FROM_OVERPAYMENT',  
  Normal_Payment ='Normal_Payment'     
}

export class CreatePaymentDto {
  @IsOptional()
  @IsNumber()
  amountPaid?: number; // El monto pagado

  @IsOptional()
  @IsNumber()
  appliedAmount?:number; // El monto aplicado

  @IsOptional()
  @IsNumber()
  excessAmount?:number; //El monto que sobro

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  datePayment?: Date;

  @IsOptional()
  @IsString()
  methodPayment?: string = PaymentMethod.CASH;

  @IsOptional()
  @IsString()
  source?: string = SourcePayment.Normal_Payment;     

  @IsOptional()
  @IsString()
  status?:string=StateLoan.PAID;
  
  @IsOptional()
  @IsNumber()
  loanQuotaId?: number;

  @IsNumber()
  @IsOptional()
  userClienteId?: number;
  
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsString()
  receiptPdf?: string;
}
