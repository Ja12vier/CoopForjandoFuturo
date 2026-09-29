import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Loan } from '../../entities/loan.entity';
import { CreateLoanDto } from '../../dto/create-loan.dto';
import { LoanQuota } from 'src/modules/loan-quotas/entities/loan-quota.entity';

@Injectable()
export class CreateLoanLoanquotaService {

   async loansCreate(manager:EntityManager, calculateLoan:any, createDto:CreateLoanDto){
      const loan=await manager.save(Loan,({
              ...createDto,
              loan:calculateLoan.loan,
              interestTotal:calculateLoan.interestTotal,
              amountDue:calculateLoan.loan,
              dateEnd:calculateLoan.quotasDetail.reverse()[0]?.datePay
            }));
      return loan;
   }

   async loanQuotaCreate(manager:EntityManager, calculateLoan:any, loan:Loan,){
      const loandetail=calculateLoan.quotasDetail;
           
      for(const detail of loandetail){  
        await manager.save(LoanQuota,{
          numberQuota:detail.quotaNumber,
          amountQuota:detail.quotaToPay,
          interestQuota:detail.interestQuota,
          capitalQuota:detail.capitalQuota,
          debtQuota:detail.quotaToPay,
          datePay:detail.datePay,
          payment:detail.payment,
          userClientId:loan.userClientId,
          loanId:loan.id
        });
      } 

   }
   
}
