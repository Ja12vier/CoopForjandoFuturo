import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UsersClient } from './entities/users-client.entity';
import { CreateUsersClientDto } from './dto/create-users-client.dto';
import { UpdateUsersClientDto } from './dto/update-users-client.dto';
import { Counter } from './entities/counter.entity';

@Injectable()
export class UsersClientsService {
  constructor(
    @InjectRepository(UsersClient)
    private readonly usersClientRepository: Repository<UsersClient>,

    @InjectRepository(Counter)
    private readonly counterRepository:Repository<Counter>,

    private readonly dataSource:DataSource,
  ) {}

  async create(createDto: CreateUsersClientDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const {email, phone, numberCard}=createDto;
      //0020250000  0120250001   0020260100
      const year= new Date().getFullYear();
      const existEmail= await queryRunner.manager.findOne(this.usersClientRepository.target, {where:{email}, lock:{mode:'pessimistic_write'}});
      if(existEmail) throw new NotFoundException(`Email ${email} already exist`);

      const existPhone= await queryRunner.manager.findOne(this.usersClientRepository.target, {where:{phone}, lock:{mode:'pessimistic_write'}});
      if(existPhone) throw new NotFoundException(`Phone ${phone} already exist`);

      const existNumberCard= await queryRunner.manager.findOne(this.usersClientRepository.target, {where:{numberCard}, lock:{mode:'pessimistic_write'}});
      if(existNumberCard) throw new NotFoundException(`NumberCard ${numberCard} already exist`);
      
      const dateEntry= new Date().toISOString().split('T')[0];
      let counter= await queryRunner.manager.findOne(this.counterRepository.target, {where:{id:1}});
      
      if(!counter){
        counter=queryRunner.manager.create(this.counterRepository.target, {lastAccountNumber:0});
        await queryRunner.manager.save(counter);
      }
      counter.lastAccountNumber += 1;

      const prefix=(counter.lastAccountNumber % 100).toString().padStart(2,'0');
      const suflix=counter.lastAccountNumber.toString().padStart(4,'0');

      let numberAccount=`${prefix}${year}${suflix}`;

      await queryRunner.manager.save(counter);
      const client = queryRunner.manager.create(this.usersClientRepository.target, {...createDto,  numberAccount, dateEntry });
      await queryRunner.manager.save(client);
      await queryRunner.commitTransaction();
      return client;
      
    } catch (error) {
      await queryRunner.rollbackTransaction(); // se revierte la transacción en caso de error
      throw error;
    }
    finally{
      await queryRunner.release();//esto libera el query runner
    }
    
  }

  async findAll() {
    const clients = await this.usersClientRepository.find({
      relations:['user', 'savingsWithdrawal', 'loan', 'loan.loanQuotas'],
       order:{id:'DESC', savingsWithdrawal:{id:'DESC'}, loan:{id:'DESC', loanQuotas:{id:'DESC'}}},
  
    });
    return clients;
  }

  async findOne(id: number) {
    const client = await this.usersClientRepository.findOneBy({ id });
    if (!client) throw new NotFoundException(`UsersClient with id ${id} not found`);
    return client;
  }

  async update(id: number, updateDto: UpdateUsersClientDto) {
    const client = await this.usersClientRepository.preload({ id, ...updateDto });
    if (!client) throw new NotFoundException(`UsersClient with id ${id} not found`);
    await this.usersClientRepository.save(client);
    return client;
  }

  async remove(id: number) {
    const result = await this.usersClientRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`UsersClient with id ${id} not found`);
    return `This action removes a #${id} usersClient`;
  }
}
