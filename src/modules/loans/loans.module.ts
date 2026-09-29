import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoansService } from './loans.service';
import { LoansController } from './loans.controller';
import { Loan } from './entities/loan.entity';
import { LoanQuota } from '../loan-quotas/entities/loan-quota.entity';
import { UsersClient } from '../users-clients/entities/users-client.entity';
import { CalculationLoanTypeService } from './services/calculation-loan-type/calculation-loan-type.service';
import { UpdateLoanUserclientService } from './services/update-loan-userclient/update-loan-userclient.service';
import { CreateLoanLoanquotaService } from './services/create-loan-loanquota/create-loan-loanquota.service';
import { ScheduleModule } from '@nestjs/schedule';
import { LoanInterestService } from './services/loan-interest/loan-interest-declining.service';
import { LoanInterestScheduler } from './schedulers/loan-interest-declinig.scheduler';
import { LoanInterestFixedService } from './services/loan-interest/loan-interest-fixed.service';
import { LoanInterestFixedScheduler } from './schedulers/loan-interes-fixed.scheduler';

@Module({
  imports: [
    TypeOrmModule.forFeature([Loan, LoanQuota, UsersClient]),
    ScheduleModule.forRoot()
  ],
  controllers: [LoansController],
  providers: [
    LoansService,
    CalculationLoanTypeService,
    UpdateLoanUserclientService,
    CreateLoanLoanquotaService,
    LoanInterestService,
    LoanInterestScheduler,
    LoanInterestFixedService,
    LoanInterestFixedScheduler
  
  ],
    
})
export class LoansModule {}
