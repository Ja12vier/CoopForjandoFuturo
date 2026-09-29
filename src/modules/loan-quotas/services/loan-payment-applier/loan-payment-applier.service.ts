import { Injectable } from '@nestjs/common';
import { Loan } from 'src/modules/loans/entities/loan.entity';
import { ExcesPaymentAction, LoanQuota} from '../../entities/loan-quota.entity';
import { LoanQuotasService } from '../../loan-quotas.service';
import { PaymentCaculationResult } from '../loan-calculator/loan-calculator.service';
import { UpdateLoanQuotaDto } from '../../dto/update-loan-quota.dto';
import { Payment } from 'src/modules/payments/entities/payment.entity';
import { EntityManager } from 'typeorm';
import { LoanCalculationType } from 'src/modules/loans/dto/create-loan.dto';


@Injectable()
export class LoanPaymentApplierService {
 

    private async PaymentQuota(
    manager: EntityManager,
    loanId: number,
    loanQuotaId: number,
    userId: number,
    calculator: PaymentCaculationResult,
    appliedAmount?: number,
    excessAmount?: number,
    methodPayment?:string,
    source?:string,
    status?:string 
    ){

      const payment = manager.create(Payment, {
        amountPaid: calculator.incomingPayment,  // El monto pagado
        appliedAmount,                           // El monto aplicado
        excessAmount,                            // El monto sobrante
        methodPayment,
        source,
        datePayment:new Date(),
        status,   
        loanId,
        userId,
        userClienteId:10,
        loanQuotaId
      });

      await manager.save(payment);
    
      }
    async applyPaidQuota(manager: EntityManager, loan: Loan, loanQuota: LoanQuota, calculator : PaymentCaculationResult, updateDto:UpdateLoanQuotaDto){
     if (calculator.incomingPayment > 0 && calculator.newTotalPayment >= calculator.quotaAmount) {
        loan.amountDue -= calculator.incomingPayment; 
        loanQuota.installmentPayment = calculator.newTotalPayment;
        loanQuota.interestQuota = Math.max(0, Number(loanQuota.interestQuota) - calculator.incomingPayment);
        loanQuota.status = 'Paid';
 
        await this.PaymentQuota(
          manager,
          loan.id,
          loanQuota.id,
          loan.userId,
          calculator, 
          calculator.incomingPayment,
          0,
          updateDto.methodPayment ,
          "Normal_Payment", 
          loanQuota.status  );
      }    
    }
 //totalDebt: calculator.penaltyAmount - calculator.currentPayment,
    async applyPartialQuota(
      manager: EntityManager,
      loan: Loan,
      calculator : PaymentCaculationResult, 
      loanQuota: LoanQuota, 
      action?: string,
      updateDto?:UpdateLoanQuotaDto
      )                                  // 1000                            2000  
      {
           
        let shouldCreatePayment = false;
        const loanOne = await manager.findOne(Loan, {where:{id:loanQuota.loanId}});
         
        if(loanOne?.typeLaonCalculation == LoanCalculationType.DECLINING_BALANCE){
            let pay = calculator.incomingPayment;

            let interestPay= Math.min(pay, Number(loanQuota.interestQuota));
            loanQuota.interestQuota -= interestPay;
            pay -= interestPay;

            let penaltyPay = Math.min(pay, Number(loanQuota.penaltyAmount));
            loanQuota.penaltyAmount -= penaltyPay;
            pay -= penaltyPay; 

            let capitalPay =  Math.min(pay, Number(loanQuota.capitalQuota));
            loanQuota.capitalQuota -= capitalPay;
            pay -= capitalPay;
         }

        if (calculator.incomingPayment > 0 && calculator.newTotalPayment < calculator.penaltyAmount){
         loan.amountDue -= calculator.incomingPayment;
         loanQuota.installmentPayment = Number(loanQuota.installmentPayment) + Number(calculator.incomingPayment);
         loanQuota.status = 'Partial';
         shouldCreatePayment = true;


        }
  
       if(calculator.newTotalPayment == calculator.penaltyAmount){
         loan.amountDue -= calculator.incomingPayment;
         loanQuota.installmentPayment = calculator.newTotalPayment;
         loanQuota.status = 'Paid';
        shouldCreatePayment = true;
       }
        
       console.log(shouldCreatePayment);
       if (shouldCreatePayment === true){
         await this.PaymentQuota(
          manager,
          loan.id,
          loanQuota.id,
          loan.userId,
          calculator, 
          calculator.incomingPayment,
          0,
          updateDto?.methodPayment ,
          "Normal_Payment", 
          loanQuota.status  ,
        );
       }
       
      console.log("ESTE",calculator.incomingPayment, calculator.newTotalPayment, calculator.penaltyAmount);
      
      if(calculator.incomingPayment > 0 && calculator.newTotalPayment > calculator.penaltyAmount){
        
        await this.Overpayment(manager, loan, calculator, loanQuota, action, updateDto);
       }
    } 

    private async Overpayment(manager: EntityManager, loan: Loan, calculator : PaymentCaculationResult, loanQuota: LoanQuota, action?: string, updateDto?:UpdateLoanQuotaDto){
        const {incomingPayment, newTotalPayment, creditBalance} = calculator;
          let followingQuota = await manager.findOne(LoanQuota, {
            where: {loanId: loan.id,numberQuota:Number(loanQuota.numberQuota) +1}});

          if(creditBalance > 0 && action == ExcesPaymentAction.APPLY_TO_NEXT_INSTALLMENT && followingQuota){
                loanQuota.installmentPayment = newTotalPayment - creditBalance; 
                loan.amountDue=Number(loan.amountDue) - incomingPayment;
                followingQuota.installmentPayment=Number(followingQuota.installmentPayment) + creditBalance; 
                followingQuota.status = 'Partial';
                loanQuota.action = ExcesPaymentAction.APPLY_TO_NEXT_INSTALLMENT;   //aplicar a la siguiente cuota
                 console.log("ello se ejecuto");
                 
                followingQuota.debtQuota = (Number(followingQuota.amountQuota)  + Number(followingQuota.penaltyAmount)) - creditBalance;
                await this.PaymentQuota(
                  manager,
                  loan.id,
                  loanQuota.id,
                  loan.userId,
                  calculator,                         // el monto pagado
                  newTotalPayment - creditBalance,    //  El monto aplicado
                  followingQuota.installmentPayment,  // El monto sobrante
                  updateDto?.methodPayment ,
                  "Normal_Payment", 
                  loanQuota.status );
       
                if(followingQuota){
                  await this.PaymentQuota(
                    manager,
                    followingQuota.loanId,
                    followingQuota.id,
                    loan.userId,
                    calculator,                        // el monto pagado
                    followingQuota.installmentPayment, //  El monto aplicado
                    0,                                 // El monto sobrante
                    updateDto?.methodPayment ,
                    "FROM_OVERPAYMENT", 
                    loanQuota.status );
                }
                await manager.save(followingQuota);

              }

              if(creditBalance > 0 && action == ExcesPaymentAction.CREDIT_BALANCE){
                loanQuota.installmentPayment = newTotalPayment - creditBalance;
                loan.creditBalance=Number(loan.creditBalance) + creditBalance;
                loan.amountDue=Number(loan.amountDue) - (incomingPayment - creditBalance);
                loanQuota.action = ExcesPaymentAction.CREDIT_BALANCE;   //registrar como saldo a favor
              }

              if(creditBalance > 0 && action == ExcesPaymentAction.REFUND){
                loanQuota.installmentPayment = newTotalPayment - creditBalance;
                loan.amountDue= Number(loan.amountDue) - (incomingPayment - creditBalance);
                loanQuota.action = ExcesPaymentAction.REFUND;   //Devolver el dinero al cliente
              }
              
              loanQuota.status = 'Paid';
              console.log("ESTE",calculator.currentPayment, loanQuota.debtQuota, calculator.incomingPayment,updateDto?.action );
          }

         
          applyPaymentLoanQuota(){
           
          }

    }


