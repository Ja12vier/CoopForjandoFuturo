import { BadRequestException, Injectable } from '@nestjs/common';
import { PaymentCaculationResult } from '../loan-calculator/loan-calculator.service';

@Injectable()
export class LoanValidationService {

    validateStatusLoanQuota(status: string | undefined, calculator : PaymentCaculationResult){
      // No se puede establecer manualmente como vencido
         if(status === 'Overdue'){
           throw new BadRequestException('You cannot set the status to Overdue manually');
         }
         
      // Pago completo de la cuota
         if (status === 'Paid') {
          // Si se pagó con abono adicional
            
            if(calculator.penaltyAmount > calculator.newTotalPayment){
                throw new BadRequestException("It cannot be marked as paid until the payment is completed.");
            }

            if(calculator.currentPayment  >= calculator.penaltyAmount){
                throw new BadRequestException('This quota has already been paid.');
            }
         }

         if(status === 'Partial') {
            if(calculator.incomingPayment > 0 && calculator.newTotalPayment > calculator.quotaAmount){
            throw new BadRequestException('If you are making the full payment, mark it as paid.');
            }

         }
    }
}
