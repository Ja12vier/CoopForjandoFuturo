import { PartialType } from '@nestjs/mapped-types';
import { CreateFinancialStatisticsDto } from './create-financial-statistics.dto';

export class UpdateFinancialStatisticsDto extends PartialType(CreateFinancialStatisticsDto) {}
