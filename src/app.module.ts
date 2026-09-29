import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UsersModule } from './modules/users/users.module';
import { LoansModule } from './modules/loans/loans.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersClientsModule } from './modules/users-clients/users-clients.module';
import { SavingsWithdrawalsModule } from './modules/savings-withdrawals/savings-withdrawals.module';
import { LoanQuotasModule } from './modules/loan-quotas/loan-quotas.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type:'postgres',
      url:process.env.DATABASE_URL,
      autoLoadEntities:true,
      synchronize:true
    }),
    ServeStaticModule.forRoot({
      rootPath:join(__dirname, '..','public'),
      renderPath:'/'
    }),
    
      ScheduleModule.forRoot(),
    UsersModule,
    LoansModule,
    AuthModule,
    UsersClientsModule,
    SavingsWithdrawalsModule,
    LoanQuotasModule,
    PaymentsModule
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
11