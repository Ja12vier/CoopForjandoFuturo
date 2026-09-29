import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoanQuota } from './entities/loan-quota.entity';
import { LoanQuotasService } from './loan-quotas.service';
import { LoanQuotasController } from './loan-quotas.controller';
import { Loan } from '../loans/entities/loan.entity';
import { LoanCalculatorService } from './services/loan-calculator/loan-calculator.service';
import { LoanValidationService } from './services/loan-validation/loan-validation.service';
import { LoanPaymentApplierService } from './services/loan-payment-applier/loan-payment-applier.service';
import { Payment } from '../payments/entities/payment.entity';
import { PaymentCreateService } from './services/payment-create/payment-create.service';

@Module({
  imports: [TypeOrmModule.forFeature([LoanQuota, Loan, Payment])],
  controllers: [LoanQuotasController],
  providers: [LoanQuotasService, LoanCalculatorService, LoanValidationService, LoanPaymentApplierService, PaymentCreateService],
})
export class LoanQuotasModule {}
