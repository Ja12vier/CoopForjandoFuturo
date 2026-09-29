import { PartialType } from '@nestjs/mapped-types';
import { CreateLoanQuotaDto } from './create-loan-quota.dto';

export class UpdateLoanQuotaDto extends PartialType(CreateLoanQuotaDto) {}
