import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { SavingsWithdrawal } from './entities/savings-withdrawal.entity';
import { CreateSavingsWithdrawalDto, TypeSavingsWithdrawal } from './dto/create-savings-withdrawal.dto';
import { UpdateSavingsWithdrawalDto } from './dto/update-savings-withdrawal.dto';
import { UsersClient } from '../users-clients/entities/users-client.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class SavingsWithdrawalsService {
  constructor(
    @InjectRepository(SavingsWithdrawal)
    private readonly savingsWithdrawalRepository: Repository<SavingsWithdrawal>,

    @InjectRepository(UsersClient)
    private readonly usersClientRepository: Repository<UsersClient>,

    private readonly dataSource:DataSource
  ) {}

  async create(createDto: CreateSavingsWithdrawalDto) {
     const queryRunner=this.dataSource.createQueryRunner();
     await queryRunner.connect();
     await queryRunner.startTransaction();

    try {
        const {type, amount, userClientId}=createDto;
        const userClient = await queryRunner.manager.findOne(
          this.usersClientRepository.target,{where: {id: userClientId}, lock:{mode:'pessimistic_write'}});
        if (!userClient) throw new NotFoundException(`UserClient with id ${createDto.userClientId} not found`);
        
        if(type == TypeSavingsWithdrawal.WITHDRAWAL && userClient.balanceCurrent < amount){
          throw new BadRequestException('Insufficient balance');
        }

        userClient.balanceCurrent=Number(userClient.balanceCurrent) + (type == TypeSavingsWithdrawal.SAVINGS ? Number(amount) : -Number(amount));
        if(type == TypeSavingsWithdrawal.WITHDRAWAL){
          userClient.retireTotal = Number(userClient.retireTotal) +  Number(amount);
        }
        await queryRunner.manager.save(userClient);

        const numberAccount = userClient.numberAccount;
        
        const savingsWithdrawal = queryRunner.manager.create(this.savingsWithdrawalRepository.target,{...createDto, numberAccount});
        await queryRunner.manager.save(savingsWithdrawal);
        await queryRunner.commitTransaction();
        return{
          message: type == TypeSavingsWithdrawal.SAVINGS ? 'Savings  successfully' : 'Withdrawal  successfully',
          newBalance: userClient.balanceCurrent,
          savingsWithdrawal};

     } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    }
    finally{
      await queryRunner.release();
    }

  }

  async findAll(type?: TypeSavingsWithdrawal, startDate?: Date, endDate?: Date, userClientId?: number) {
  //   Obtener todos sin filtros
  //  GET /savings-withdrawals

  //  Filtrar solo por tipo
  //  GET /savings-withdrawals?type=SAVINGS

  //  Filtrar por rango de fechas
  //  GET /savings-withdrawals?startDate=2024-01-01&endDate=2024-12-31

  //  Filtrar por cliente específico
  //  GET /savings-withdrawals?userClientId=123

  //  Combinar múltiples filtros
  //  GET /savings-withdrawals?type=SAVINGS&startDate=2024-01-01&userClientId=123

    const where: any = {};
    if(type) where.type=type;

    if(userClientId) where.userClientId=userClientId;

    if(startDate || endDate){
      where.createdAt={};
      if(startDate){
        where.createdAt=MoreThanOrEqual(new Date(startDate));
      }
      if(endDate){
          where.createdAt={...where.createdAt, LessThanOrEqual:new Date(endDate) };
      }
    }

    const savingsWithdrawals= await this.savingsWithdrawalRepository.find({
      where,
      relations:['userClient','user'],
      order:{id:'DESC'},
    });
    return savingsWithdrawals;
  }

  async findOne(id: number) {
    const withdrawal = await this.savingsWithdrawalRepository.findOne(
      { where: { id }, relations: ['userClient', 'user'] },
    );
    if (!withdrawal) throw new NotFoundException(`SavingsWithdrawal with id ${id} not found`);
    return withdrawal;
  }

  async update(id: number, updateDto: UpdateSavingsWithdrawalDto) {

    const queryRunner= this.dataSource.createQueryRunner();
     await queryRunner.connect();
     await queryRunner.startTransaction();
    try {

      const {type, amount}=updateDto;
      const userClient= await queryRunner.manager.findOneBy(this.usersClientRepository.target, {id:updateDto.userClientId});
      if(!userClient) throw new NotFoundException(`UsersClient with id ${id} not found`);

      const savingsWithdrawal= await queryRunner.manager.findOneBy(this.savingsWithdrawalRepository.target,{id});
      if(!savingsWithdrawal) throw new NotFoundException(`SavingsWithdrawal with id ${id} not found`);

      if(savingsWithdrawal.type == TypeSavingsWithdrawal.SAVINGS){
       userClient.balanceCurrent = Number(userClient.balanceCurrent) - savingsWithdrawal.amount
      }

      if(savingsWithdrawal.type == TypeSavingsWithdrawal.WITHDRAWAL){
        userClient.balanceCurrent = Number(userClient.balanceCurrent) +Number( savingsWithdrawal.amount);
        userClient.retireTotal = Number(userClient.retireTotal) - savingsWithdrawal.amount;
      }
      
      userClient.balanceCurrent=Number(userClient.balanceCurrent) + (type == TypeSavingsWithdrawal.SAVINGS ? Number(amount) : -Number(amount));
      await queryRunner.manager.save(userClient);
  
      const withdrawals=await queryRunner.manager.preload(this.savingsWithdrawalRepository.target, {id, ...updateDto});
       if (!withdrawals) throw new NotFoundException(`SavingsWithdrawal with id ${id} not found`);
       await queryRunner.manager.save(withdrawals);
       await queryRunner.commitTransaction();
       return{
        message: type == TypeSavingsWithdrawal.SAVINGS ? 'Savings  successfully' : 'Withdrawal  successfully',
        newBalance:userClient.balanceCurrent,
        withdrawals
       }

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
      
    }
     finally{
      await queryRunner.release();
     }
  }

  async remove(id: number) {
    const result = await this.savingsWithdrawalRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`SavingsWithdrawal with id ${id} not found`);
    return `This action removes a #${id} savingsWithdrawal`;
  }

  
  // Historial de ahorros y retiros por cliente
  async findHistoryBy(userClientId:number){
    const history=await this.savingsWithdrawalRepository.find({
      where:{userClientId},
      order:{id:'DESC'},
      relations:['userClient', 'user']
    });

    return{
      message:'History successfully',
      history
    }
    
  }
}
