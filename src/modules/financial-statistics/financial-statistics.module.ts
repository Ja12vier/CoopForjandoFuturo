import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialStatistics } from './entities/financial-statistics.entity';
import { FinancialStatisticsService } from './financial-statistics.service';
import { FinancialStatisticsController } from './financial-statistics.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FinancialStatistics])],
  controllers: [FinancialStatisticsController],
  providers: [FinancialStatisticsService],
})
export class FinancialStatisticsModule {}
