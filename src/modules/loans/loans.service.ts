import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from './entities/loan.entity';
import { CreateLoanDto, LoanCalculationType } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { CalculateLoanDto } from './dto/calculate-loan.dto';
import { LoanQuota } from '../loan-quotas/entities/loan-quota.entity';
import { DataSource } from 'typeorm';
import { UsersClient } from '../users-clients/entities/users-client.entity';
import { CalculationLoanTypeService } from './services/calculation-loan-type/calculation-loan-type.service';
import { UpdateLoanUserclientService } from './services/update-loan-userclient/update-loan-userclient.service';
import { CreateLoanLoanquotaService } from './services/create-loan-loanquota/create-loan-loanquota.service';

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(Loan)
    private readonly loanRepository: Repository<Loan>,
    
    @InjectRepository(UsersClient)
    private readonly usersClientRepository: Repository<UsersClient>,

    private readonly calculationLoanTypeService:CalculationLoanTypeService,
    private readonly updateLoanUserclientService : UpdateLoanUserclientService,
    private readonly createLoanLoanquotaService : CreateLoanLoanquotaService,

    private readonly dataSource:DataSource
  ) {}



  async create(createDto: CreateLoanDto, ) {
    const queryRunner=this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

    let  {amountAproved, interestRate, dateStart, payment, typeLaonCalculation}=createDto;
      if(!dateStart) throw new BadRequestException('invalid dateStart');

    try {
      
      if(typeLaonCalculation === LoanCalculationType.DECLINING_BALANCE) createDto.quotas = 1;
       
      const calculateLoan=await this.calculationLoanTypeService.calculatorsLoanFixed(
          amountAproved, interestRate, createDto.quotas, payment, dateStart);
        if(!calculateLoan) throw new NotFoundException( 'All fields are required');
          
      const loans=await this.createLoanLoanquotaService.loansCreate(queryRunner.manager,calculateLoan, createDto);
          console.log(loans);
      await this.createLoanLoanquotaService.loanQuotaCreate(queryRunner.manager,calculateLoan, loans);
      await this.updateLoanUserclientService.updateUserClientLoan(queryRunner.manager, createDto );
         
      
      await queryRunner.commitTransaction();
      return{
        loans
      }  
    }catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    }finally{
      await queryRunner.release();
    }
  }

  async findAll() {
    return await this.loanRepository.find({
      relations:['userClient','user', 'loanQuotas', 'loanQuotas.payments'],
      order:{id:'DESC', loanQuotas:{id:'DESC'}}
    });
  }

  async findOne(id: number) {
    const loan = await this.loanRepository.findOne({ 
      where: { id },
      relations:['userClient','user', 'loanQuotas', 'loanQuotas.payments'],
      order:{loanQuotas:{id:'DESC'}}
    });
    if (!loan) throw new NotFoundException(`Loan with id ${id} not found`);
    return loan;
  }

  async update(id: number, updateDto: UpdateLoanDto) {
    const {userClientId}=updateDto;

    const userClientExists= await this.usersClientRepository.findOne({where:{id:userClientId}});    
    if(!userClientExists) throw new NotFoundException(`Loan with id ${userClientId} not found`);

    const loan = await this.loanRepository.preload({ id, ...updateDto});
    if (!loan) throw new NotFoundException(`Loan with id ${id} not found`);
    await this.loanRepository.save(loan);
    return loan;
  }

  async remove(id: number) {
    // const loan = await this.findOne(id);
    // const lonaQuotaStatus= loan.loanQuotas.some(quota=> quota.status !== 'Pending');
    // if(lonaQuotaStatus) throw new BadRequestException('Cannot delete a loan with paid, Pending,Overdue quotas');
    // if(loan.loan != loan.amountDue) throw new BadRequestException('This loan cannot be cancelled, even if the installment has been paid.');
    
    // const userClient= await this.usersClientRepository.findOne({where:{id:loan.userClientId}});
    // if(!userClient) throw new NotFoundException(`UserClient with id ${loan.userClientId} not found`);
    // userClient.totalLoans=userClient.totalLoans -= 1;
    // userClient.activeLoans=userClient.activeLoans -= 1;
    // await this.usersClientRepository.save( userClient);
    
    const result = await this.loanRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Loan with id ${id} not found`);
    return `This action removes a #${id} loan`;
  }
}
