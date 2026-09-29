import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Loan } from '../../entities/loan.entity';
import { DataSource, Not, Repository } from 'typeorm';
import { LoanQuota } from 'src/modules/loan-quotas/entities/loan-quota.entity';
import { CalculationLoanTypeService } from '../calculation-loan-type/calculation-loan-type.service';
import { LoanCalculationType, LoanType, StateLoan } from '../../dto/create-loan.dto';
import { log } from 'node:console';

@Injectable()
export class LoanInterestService {
    private readonly logger = new Logger(LoanInterestService.name);
    constructor(
        @InjectRepository(Loan)
        private readonly loanRepository: Repository<Loan>,

        @InjectRepository(LoanQuota)
        private readonly loanQuotaRepository: Repository<LoanQuota>,

        private readonly calculationLoanTypeService : CalculationLoanTypeService,
        private readonly datasource: DataSource
    ){}

    async calculateInterestForAllDecliningBalanceLoans() {
     const loans = await this.loanRepository.find({
        where: {
            state:Not('Paid'),
            typeLaonCalculation:LoanCalculationType.DECLINING_BALANCE},
            relations: ['loanQuotas']});
      
     let processed=0;
     let failed=0;

     for(const loan of loans){
        try{
            await this.calculateInterestDecliningBalance(loan);
            processed++;
        }catch(error:any){
            failed++;
            this.logger.error(`Error processing loan with ID ${loan.id}: ${error.message}`);
            
        }
     }
      this.logger.log(`Processed ${processed} loans successfully, ${failed} loans failed.`);
    }

    private async calculateInterestDecliningBalance(loan: Loan){
        const queryRunner = this.datasource.createQueryRunner();
         await queryRunner.connect();
         await queryRunner.startTransaction();

        const dateEnd = new Date(loan.dateEnd);
        const dateEndGracePeriod = new Date(dateEnd);
        const gracePeriodDays = loan.gracePeriodDays || 1; // si no marcas dias de gracia pone 1
        const date = new Date();
        
        dateEndGracePeriod.setDate(dateEndGracePeriod.getDate() + gracePeriodDays);

        try {
          if (date > dateEndGracePeriod) {
            const calculatedInterest = await this.calculationLoanTypeService.calculatorsLoanFixed(
                loan.amountDue,
                loan.interestRate,
                loan.quotas,
                loan.payment,
                loan.dateStart
            );

            loan.penaltyFeeTotal = Number(loan.penaltyFeeTotal) + Number(calculatedInterest.interestTotal);
            loan.loan = Number(loan.loan) + Number(calculatedInterest.interestTotal);
            loan.dateEnd = calculatedInterest.datepayEnd;
            loan.amountDue = Number(loan.amountDue) + Number(calculatedInterest.interestTotal);
            loan.state = StateLoan.OVERDUE;

            const loanQuota = loan.loanQuotas[0];
            loanQuota.debtQuota = Number(loanQuota.debtQuota) + Number(calculatedInterest.interestTotal);
            loanQuota.datePay = calculatedInterest.datepayEnd;
            loanQuota.penaltyAmount = Number(loanQuota.penaltyAmount) + Number(calculatedInterest.interestTotal);
            loanQuota.penaltyCount = (loanQuota.penaltyCount || 0) + 1;
            loanQuota.status = StateLoan.OVERDUE;

            await this.loanQuotaRepository.save(loanQuota);
            await this.loanRepository.save(loan);
            await queryRunner.commitTransaction();
          }
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }finally{
            await queryRunner.release();
        }
        
    }
}

