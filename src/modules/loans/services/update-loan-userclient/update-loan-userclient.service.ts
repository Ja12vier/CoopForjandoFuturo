import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersClient } from 'src/modules/users-clients/entities/users-client.entity';
import { EntityManager } from 'typeorm';
import { CreateLoanDto } from '../../dto/create-loan.dto';

@Injectable()
export class UpdateLoanUserclientService {

    async updateUserClientLoan(manager:EntityManager, createDto:CreateLoanDto ){
      const userClient= await manager.findOne(UsersClient,{where:{id:createDto.userClientId}});
         if(!userClient) throw new NotFoundException(`UserClient with id ${createDto.userClientId} not found`);
           userClient.totalLoans=userClient.totalLoans += 1;
           userClient.activeLoans=userClient.activeLoans += 1;
           await manager.save(userClient);
    }

    
}
