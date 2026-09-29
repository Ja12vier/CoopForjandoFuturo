import { Injectable } from '@nestjs/common';
import { LoanQuota } from '../../entities/loan-quota.entity';



export interface PaymentCaculationResult {
   incomingPayment: number;
   currentPayment: number;
   newTotalPayment: number;
   quotaAmount: number;
   penaltyAmount: number;
   creditBalance: number;
}
@Injectable()
export class LoanCalculatorService {

    calculatePayment(loanQuota: LoanQuota, installmentPayment : number ) : PaymentCaculationResult{
        const incomingPayment = Number(installmentPayment) ?? 0; //?? sirven para valores nulos o indefinidos usa el valor de la derecha si es nulo o indefinido
        const currentPayment =Number(loanQuota.installmentPayment);
        const newTotalPayment = (currentPayment) + (incomingPayment)
        const quotaAmount = Number(loanQuota.amountQuota);
        const penaltyAmount = Number(loanQuota.penaltyAmount ?? 0) + (quotaAmount);
        const creditBalance = newTotalPayment - penaltyAmount;  // SI DA UN NUMERO NEGATIVO ES QUE AUN DEBE Y ESE NUMERO ES LO QUE DEBE, SI DA POSITIVO ES QUE LE SOBRA Y ESE NUMERO ES EL SALDO A FAVOR DEL CLIENTE
        return {incomingPayment, currentPayment, newTotalPayment, quotaAmount, penaltyAmount, creditBalance};
    }
}

