import { Injectable } from '@nestjs/common';
import { Loan } from 'src/modules/loans/entities/loan.entity';
import { EntityManager, Repository } from 'typeorm';
import { PaymentCaculationResult } from '../loan-calculator/loan-calculator.service';
import { LoanQuota } from '../../entities/loan-quota.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from 'src/modules/payments/entities/payment.entity';
import { UpdateLoanQuotaDto } from '../../dto/update-loan-quota.dto';

@Injectable()
export class PaymentCreateService {

    constructor( 
  
    ){}
    async createPayment(
        manager:EntityManager, 
        loan:Loan, 
        calculator:PaymentCaculationResult, 
        loanQuota:LoanQuota, 
        updateDto:UpdateLoanQuotaDto)
    {
    

        const payment= manager.create(Payment, {});

        payment.amountPaid = calculator.incomingPayment; // cuanto esta pagando en este momento
        

    }     
        


}

