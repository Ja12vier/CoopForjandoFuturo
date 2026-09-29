import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavingsWithdrawal } from './entities/savings-withdrawal.entity';
import { SavingsWithdrawalsService } from './savings-withdrawals.service';
import { SavingsWithdrawalsController } from './savings-withdrawals.controller';
import { UsersClient } from '../users-clients/entities/users-client.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SavingsWithdrawal, UsersClient]),
    AuthModule
  ],
  controllers: [SavingsWithdrawalsController],
  providers: [SavingsWithdrawalsService],
})
export class SavingsWithdrawalsModule {}
