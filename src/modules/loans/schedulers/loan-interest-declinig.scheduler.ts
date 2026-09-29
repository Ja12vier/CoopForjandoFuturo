import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Loan } from "../entities/loan.entity";
import { Repository } from "typeorm";
import { LoanQuota } from "src/modules/loan-quotas/entities/loan-quota.entity";
import { Cron, CronExpression } from "@nestjs/schedule";
import { LoanInterestService } from "../services/loan-interest/loan-interest-declining.service";



@Injectable()
export class LoanInterestScheduler{
    private readonly logger = new Logger(LoanInterestScheduler.name);
    constructor(
      private readonly loanInterestService : LoanInterestService
    ){}

  @Cron('0 6 * * *', {timeZone: 'America/Santo_Domingo'})
  async applyInterestDecliningCron() {
    try {
      await this.loanInterestService.calculateInterestForAllDecliningBalanceLoans();
      this.logger.log('Interest calculation for successfully settled declining-balance loans completed.');
    } catch (error) {
      this.logger.error('Error occurred during interest calculation for declining-balance loans:', error);
      Error instanceof Error ? Error.stack : String(error);
    }
  }

}