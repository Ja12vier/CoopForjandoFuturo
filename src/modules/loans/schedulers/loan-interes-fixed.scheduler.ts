import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { LoanInterestFixedService } from "../services/loan-interest/loan-interest-fixed.service";



@Injectable()
export class LoanInterestFixedScheduler{
    private readonly logger = new Logger(LoanInterestFixedScheduler.name);

    constructor(
      private readonly loanInterestFixedService : LoanInterestFixedService
    ){}

    @Cron('0 0 * * *', {timeZone: 'America/Santo_Domingo'})
    async applyInterestFixedCron() {
        try {
          await this.loanInterestFixedService.calculateInterestForAllFixedInstallmentsLoans();
          this.logger.log('Interest calculation for successfully settled Fixed loans completed.')
        } catch (error) {
           this.logger.error(
             'Error occurred during interest calculation for Fixed loans',
              error instanceof Error ? error.stack : String(error),
           );
            
        }
    }
}
