import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { ExcesPaymentAction, LoanQuota } from './entities/loan-quota.entity';
import { CreateLoanQuotaDto } from './dto/create-loan-quota.dto';
import { UpdateLoanQuotaDto } from './dto/update-loan-quota.dto';
import { Loan } from '../loans/entities/loan.entity';
import { DataSource } from 'typeorm';
import { LoanCalculatorService } from './services/loan-calculator/loan-calculator.service';
import { LoanValidationService } from './services/loan-validation/loan-validation.service';
import { LoanPaymentApplierService } from './services/loan-payment-applier/loan-payment-applier.service';
import { log } from 'console';
import { StateLoan } from '../loans/dto/create-loan.dto';
import { Payment } from '../payments/entities/payment.entity';
import { PaymentCreateService } from './services/payment-create/payment-create.service';

@Injectable()
export class LoanQuotasService {
  constructor(
    @InjectRepository(LoanQuota)
    private readonly loanQuotaRepository: Repository<LoanQuota>,

    @InjectRepository(Payment)
    private readonly paymentRepository:Repository<Payment>,

    @InjectRepository(Loan)
     private readonly loanRepository:Repository<Loan>,

     private readonly  loanCalculatorService : LoanCalculatorService,
     private readonly  loanValidationService : LoanValidationService,
     private readonly loanPaymentApplierService : LoanPaymentApplierService,
     private readonly paymentRepositoryService :PaymentCreateService,

     private readonly dataSource:DataSource
  ) {}

  async create(createDto: CreateLoanQuotaDto) {
    const quota = this.loanQuotaRepository.create(createDto);
    await this.loanQuotaRepository.save(quota);
    return quota;
  }
  
    async findAll() {
      const quotas = await this.loanQuotaRepository.find({
        where:{status: Not('Paid')},
        relations:['loan', 'payments'],
        order:{numberQuota:'ASC', id:'DESC'}
      })
      return quotas;
    }

  async findOne(id: number) {
    const quota = await this.loanQuotaRepository.findOneBy({ id });
    if (!quota) throw new NotFoundException(`LoanQuota with id ${id} not found`);
    return quota;
  }

  async update(id: number, updateDto: UpdateLoanQuotaDto) {
   if(updateDto.status == "Cancel"){
     throw new BadRequestException("the operation has been canceled");
    }

    const queryrunner= this.dataSource.createQueryRunner();
    await queryrunner.connect();
    await queryrunner.startTransaction();

   try {
    
    const loanQuota= await queryrunner.manager.findOneBy(LoanQuota, {id});
    if(!loanQuota) throw new NotFoundException(`LoanQuota with id ${id} not found`);
    
    const loan = await queryrunner.manager.findOneBy(Loan, {id:loanQuota.loanId});
    if(!loan) throw new NotFoundException(`Loan with id ${loanQuota.loanId} not found`);

    const payment = queryrunner.manager.create(Payment, {});

    const calculator = this.loanCalculatorService.calculatePayment(loanQuota, updateDto.installmentPayment ?? 0);
      this.loanValidationService.validateStatusLoanQuota(updateDto.status, calculator);
      // console.log({
      //     loanQuotaId: loanQuota.id,
      //     amountQuota: calculator.penaltyAmount,     //cuanto es el total de la cuota incluyendo intereses y penalidades
      //     totalDebt: calculator.penaltyAmount - calculator.currentPayment,  //cuanto le falta por pagar a la cuota
      //     amountAlreadyPaid: calculator.currentPayment,  // cuanto ya tenia pagado antes de este pago
      //     incomingPayment: calculator.incomingPayment,   //cuanto esta pagando en este momento
      //     totalPaidAfterPayment : calculator.newTotalPayment,    //total de pago hasta el momento
      //     excessAmount : calculator.creditBalance,   //cuanto le sobra al cliente  // SI DA UN NUMERO NEGATIVO ES QUE AUN DEBE Y ESE NUMERO ES LO QUE DEBE, SI DA POSITIVO ES QUE LE SOBRA Y ESE NUMERO ES EL SALDO A FAVOR DEL CLIENTE
      //     availableActions:Object.values(ExcesPaymentAction)

      // });

    if(calculator.newTotalPayment > calculator.penaltyAmount && updateDto.action == null){
         
        return{
          loanQuotaId: loanQuota.id,
          amountQuota: calculator.penaltyAmount,     //cuanto es el total de la cuota incluyendo intereses y penalidades
          totalDebt: calculator.penaltyAmount - calculator.currentPayment,  //cuanto le falta por pagar a la cuota
          amountAlreadyPaid: calculator.currentPayment,  // cuanto ya tenia pagado antes de este pago
          incomingPayment: calculator.incomingPayment,   //cuanto esta pagando en este momento
          totalPaidAfterPayment : calculator.newTotalPayment,    //total de pago hasta el momento
          excessAmount : calculator.creditBalance,   //cuanto le sobra al cliente  // SI DA UN NUMERO NEGATIVO ES QUE AUN DEBE Y ESE NUMERO ES LO QUE DEBE, SI DA POSITIVO ES QUE LE SOBRA Y ESE NUMERO ES EL SALDO A FAVOR DEL CLIENTE
          availableActions:Object.values(ExcesPaymentAction),
          message:'The payment exceeds the amount owed. What would you like to do with the surplus?'
        }
       }
    
    if (updateDto.status === 'Paid'&& updateDto.action == null &&calculator.newTotalPayment >= calculator.penaltyAmount) {
       this.loanPaymentApplierService.applyPaidQuota(queryrunner.manager,loan, loanQuota, calculator, updateDto);
    }
    if (updateDto.status === StateLoan.PARTIAL || updateDto.status == StateLoan.PAID && updateDto.action != null) {
      await this.loanPaymentApplierService.applyPartialQuota(queryrunner.manager, loan, calculator, loanQuota, updateDto.action, updateDto );
    }
    //Aqui se actualiza los que el cliente debe en total.
    console.log("elllos",calculator.currentPayment, loanQuota.debtQuota, calculator.incomingPayment,updateDto.action );
    loanQuota.debtQuota = Math.max(
          0,
          calculator.penaltyAmount -
          Number(loanQuota.installmentPayment)
            );
                

    await queryrunner.manager.save(loanQuota);
    await queryrunner.manager.save(loan);
    await queryrunner.commitTransaction();

    return {loanQuota, loan};
      
   } catch (error) {
      await queryrunner.rollbackTransaction();
      throw error;
    } finally {
      await queryrunner.release();
    }
    
  }
  async remove(id: number) {
    const result = await this.loanQuotaRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`LoanQuota with id ${id} not found`);
    return `This action removes a #${id} loanQuota`;
  }
}
