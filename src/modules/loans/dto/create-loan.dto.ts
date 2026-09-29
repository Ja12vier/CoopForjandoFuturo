import { Type } from 'class-transformer';
import { IsNumber, IsString, IsOptional, IsDate, IsBoolean, IsNotEmpty, IsDateString, IsEnum, ValidateIf, equals, Equals, Min } from 'class-validator';


export enum StateLoan{
PENDING='Pending',
PAID='Paid',
OVERDUE='Overdue',
PARTIAL='Partial',
ACTIVE='Active',
   

}

export enum LoanType{
PERSONAL='Personal',
EMERGENCY='Emergency',
VEHICLE='Vehicle',
INVESTMENT='Investment'
}

export enum Payment{
MONTHLY='Monthly',
BIWEEKLY='Biweekly',
WEEKLY='Weekly'
}

export enum LoanCalculationType{
    FIXED_INSTALLMENTS='Fixed_Installments',
    DECLINING_BALANCE='Declining_Balance'
}

//'CURRENT' | 'PAID' | 'OVERDUE' | 'DEFAULTED'

export class CreateLoanDto {

@IsNumber()
amountAproved!: number;

@ValidateIf((dto)=> dto.typeLaonCalculation == LoanCalculationType.DECLINING_BALANCE)
@Equals(1, {message: 'For Declining Balance loans, the number of quotas must be 1'})
@ValidateIf((dto)=> dto.typeLaonCalculation != LoanCalculationType.DECLINING_BALANCE)
@IsNumber()
@Min(1)
quotas!: number;

@IsNumber()
interestRate!: number;

@IsNumber()
@IsOptional()
interestTotal?: number;   //INTEREST TOTAL POR EJEMPLO DE 20000 EL INTERES SERIA 5000

@IsNumber()
@IsOptional()
gracePeriodDays?: number;    // Dias de gracia PARA aplicar Mora, si no se especifica se toma 1 dias de gracia 
                            // osea al dia siguiente de la fecha de vencimiento de la cuota se aplica mora
@IsNumber()
@IsOptional()
loan?: number;

@IsNumber()
@IsOptional()
paidAmount?:number

@Type(() => Date)
@IsDate()
dateStart!: Date;

@Type(() => Date)
@IsOptional()
@IsDate()
dateEnd?: Date;

@IsEnum(LoanType)
typeLoan:LoanType=LoanType.PERSONAL;

@IsEnum(LoanCalculationType)
typeLaonCalculation:LoanCalculationType=LoanCalculationType.DECLINING_BALANCE

@IsEnum(StateLoan)
@IsOptional()
state?:string=StateLoan.PENDING;

@IsOptional()
@IsNumber()
amountDue?: number;

@IsOptional()
@IsNumber()
penaltyFeeTotal?: number;

@IsOptional()
@IsNumber()
creditBalance?: number;   //saldo a favor

@IsEnum(Payment)
payment:Payment=Payment.MONTHLY

@IsOptional()
@IsString()
guarantourName?: string;

@IsOptional()
@IsString()
receiptPdf?: string;

@IsNumber()
userId!: number;

@IsNumber()
userClientId!: number;

}
