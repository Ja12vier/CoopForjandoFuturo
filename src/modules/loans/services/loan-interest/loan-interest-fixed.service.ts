import { Injectable, Logger } from "@nestjs/common";
import { DataSource, Not, Repository } from "typeorm";
import { Loan } from "../../entities/loan.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { LoanQuota } from "src/modules/loan-quotas/entities/loan-quota.entity";
import { LoanCalculationType, Payment, StateLoan } from "../../dto/create-loan.dto";

import { CalculationLoanTypeService } from "../calculation-loan-type/calculation-loan-type.service";



@Injectable()
export class LoanInterestFixedService{
    private readonly logger = new Logger(LoanInterestFixedService.name);

    constructor(
        @InjectRepository(Loan)
        private readonly loanRepository: Repository<Loan>,

        private readonly calculationLoanTypeService : CalculationLoanTypeService,
        private readonly datasource: DataSource
    ){}

    async calculateInterestForAllFixedInstallmentsLoans(){
      const loans = await this.loanRepository.find({
              where: {
                  state:Not(StateLoan.PAID),
                  typeLaonCalculation:LoanCalculationType.FIXED_INSTALLMENTS
                },
                  relations: ['loanQuotas']});
         console.log("este es el loans", loans);
        let processed = 0;
        let failed = 0;
        // Contadores para llevar el seguimiento de los préstamos procesados y fallidos
        for(const loan of loans){
            try {
                
                await this.calculateInterestFixedInstallments(loan);
                processed++;
                this.logger.log(`Processing loan with ID ${loan.id}`);
            } catch (error: any) {
               
                failed++;
                this.logger.error(`Error processing loan with ID ${loan.id}: ${error.message}`);
            }
        }
        this.logger.log(`Processed ${processed} loans successfully, ${failed} loans failed.`);
    }

    private async calculateInterestFixedInstallments(loan: Loan){
          const queryRunner =  this.datasource.createQueryRunner();
          await  queryRunner.connect();
          await queryRunner.startTransaction();

          const payment = loan.payment;
          let dayFuterePaid=0;
          // Determinar los días futuros de pago según el tipo de pago del préstamo
            switch (payment) {
                case Payment.WEEKLY: 
                    dayFuterePaid = 7;
                    break;

                case Payment.BIWEEKLY: 
                    dayFuterePaid = 15;
                    break;

                case Payment.MONTHLY: 
                    dayFuterePaid = 30;
                    break;    
                
                default:
                    break;
            }

          try {
            const currentLoan = await queryRunner.manager.findOne(Loan, {
              where: { id: loan.id },
              lock: { mode: 'pessimistic_write' },
            });

            if (!currentLoan) {
              await queryRunner.rollbackTransaction();
              return;
            }

            const currentLoanQuotas = await queryRunner.manager.find(LoanQuota, {
              where: { loanId: currentLoan.id },
              lock: { mode: 'pessimistic_write' },
            });

            currentLoan.loanQuotas = currentLoanQuotas;
            loan = currentLoan;
            
            // Iterar sobre cada cuota del préstamo para calcular intereses y penalidades
            for(const loanQuota of loan.loanQuotas){
                if(loanQuota.status === StateLoan.PAID ||
                  Number(loanQuota.debtQuota) <= 0
                ){
                    continue; // Saltar a la siguiente cuota si ya está pagada o no tiene deuda
                }
                
                const datePay= loanQuota.datePay;
                const datePayGracePeriod= new Date(datePay);
                const gracePeriodDays = loan.gracePeriodDays || 1; // si no marcas dias de gracia pone 1
                const date = new Date();
                const datePenalty= loanQuota.lastPenaltyDate;
                const datePenaltyGracePeriod= datePenalty != null ? new Date(datePenalty) : loanQuota.lastPenaltyDate;

                datePayGracePeriod.setDate(datePayGracePeriod.getDate() + gracePeriodDays);

                if(datePenaltyGracePeriod) datePenaltyGracePeriod.setDate(datePenaltyGracePeriod.getDate() + dayFuterePaid);
                
                // Verificar si la cuota del préstamo está en mora y aplicar interés de penalidad
                if(date > datePayGracePeriod && loanQuota.status !== StateLoan.PAID && loanQuota.lastPenaltyDate == null){
                  const calculatedInterest = await this.calculationLoanTypeService.calculatorsLoanFixed(
                    loanQuota.debtQuota,
                    loan.interestRate,
                    1,
                    loan.payment,
                    loanQuota.datePay
                   ); 
                   console.log(` for loan quota with ID:  ${calculatedInterest}`);
                   const quotasDetail= calculatedInterest.quotasDetail;
                   for(let d of quotasDetail) 
                   {
                  
                    //prestamo en mora, aplicando interes de penalidad
                    loan.penaltyFeeTotal = Number(loan.penaltyFeeTotal) + Number(d.interestQuota);
                    loan.loan = Number(loan.loan) + Number(d.interestQuota);
                    loan.amountDue = Number(loan.amountDue) + Number(d.interestQuota);
                    loan.state = StateLoan.OVERDUE;


                    // aplicando interes de penalidad a la cuota del prestamo
                     loanQuota.penaltyAmount  = Number(loanQuota.penaltyAmount) + Number(d.interestQuota);
                     loanQuota.lastPenaltyDate = date;
                     loanQuota.debtQuota = Number(loanQuota.debtQuota) + Number(d.interestQuota);
                     loanQuota.status = StateLoan.OVERDUE;
                     loanQuota.penaltyCount = (loanQuota.penaltyCount || 0) + 1;
                       console.log(d);
                   }

                  console.log(` for loan quota with ID: ${quotasDetail}`);
               
                   
                  // aplicando interes de penalidad a la cuota del prestamo si ya se le ha aplicado anteriormente el interes de penalidad
                } else if(date >= datePenaltyGracePeriod && loanQuota.status !== StateLoan.PAID && 
                    loanQuota.lastPenaltyDate != null)
                {
                    const calculatedInterest = await this.calculationLoanTypeService.calculatorsLoanFixed(
                    loanQuota.debtQuota,
                    loan.interestRate,
                    1,
                    loan.payment,
                    loanQuota.datePay
                   ); 
                   console.log(` for loan quota with ID:  ${calculatedInterest}`);
                   const quotasDetail= calculatedInterest.quotasDetail;
                   for(let d of quotasDetail) 
                   {
                    //prestamo en mora, aplicando interes de penalidad
                    loan.penaltyFeeTotal = Number(loan.penaltyFeeTotal) + Number(d.interestQuota);
                    loan.loan = Number(loan.loan) + Number(d.interestQuota);
                    loan.amountDue = Number(loan.amountDue) + Number(d.interestQuota);
                    loan.state = StateLoan.OVERDUE;

                    // aplicando interes de penalidad a la cuota del prestamo
                    loanQuota.penaltyAmount  = Number(loanQuota.penaltyAmount) + Number(d.interestQuota);
                    loanQuota.lastPenaltyDate = date;
                    loanQuota.debtQuota = Number(loanQuota.debtQuota) + Number(d.interestQuota);
                    loanQuota.status = StateLoan.OVERDUE;
                    loanQuota.penaltyCount = (loanQuota.penaltyCount || 0) + 1;
                      console.log(d)
                   } 
                   console.log(`Penalty applied for loan quota with ID: ${quotasDetail}`);
                   
                }                    

             }

            await queryRunner.manager.save(loan);
            await queryRunner.manager.save(loan.loanQuotas);
            await queryRunner.commitTransaction();
          } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
          } finally {
            await queryRunner.release();
          }
    }
}