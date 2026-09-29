import { Injectable, NotFoundException } from '@nestjs/common';
import { Payment } from '../../dto/create-loan.dto';

@Injectable()
export class CalculationLoanTypeService {

    async calculatorsLoanFixed(amount:number, rate:number, quotas:number, 
        payment: Payment, dateStart:Date=new Date()){
        if(!amount || !rate || !quotas) throw new NotFoundException('All fields are required');
       
        const calculateRateQuota= rate * quotas;
        let interestTotal= amount * (calculateRateQuota / 100 );
        let totalToPay = Number(amount) + interestTotal;
        const quotasDetail:{
            quotaNumber:number;
            quotaToPay:number;
            interestQuota:number;
            capitalQuota:number;
            datePay:Date;
            payment:Payment
         }[]=[];
    
        const quotasMonthly = totalToPay / quotas;
        
        for (let i = 1; i <= quotas; i++) {
            const interest=quotasMonthly - (amount / quotas);
            const capital = quotasMonthly - interest;
            
            const datePay= this.getNextPayDate(
              new Date(dateStart),
              payment,
              i -1  //Este -1 es para que la primera cuota se genere con la fecha de inicio
            );
    
            quotasDetail.push({
            quotaNumber:i,
            quotaToPay:Number(quotasMonthly.toFixed(2)),
            interestQuota:Number(interest.toFixed(2)),
            capitalQuota:Number(capital.toFixed(2)),
            datePay,
            payment
    
          });   
    
        }
        return{
          loan:totalToPay,
          amount,
          rate,
          quotas,
          interestTotal,
          quotasDetail,
          datepayEnd:this.getNextPayDate(new Date(dateStart), payment, quotas)
        }
    
      }

      

  async calculatorsLoanDeclining(amount:number, rate:number, 
        payment: 'Monthly' | 'Biweekly' | 'Weekly', dateStart:Date=new Date()){

        
    
  }

    private getNextPayDate(start:Date,  payment: Payment, quotas:number){
    const date= new Date(start);
      if(payment == Payment.WEEKLY){
        date.setDate(date.getDate() + 7 * quotas);
      }

      if(payment == Payment.BIWEEKLY){
        date.setDate(date.getDate() + 15 * quotas);
      }

      if(payment == Payment.MONTHLY){
        date.setMonth(date.getMonth() + quotas);
      }
    return date;

  }
}

