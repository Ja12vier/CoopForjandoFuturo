import { PartialType } from '@nestjs/mapped-types';
import { CreateSavingsWithdrawalDto } from './create-savings-withdrawal.dto';

export class UpdateSavingsWithdrawalDto extends PartialType(CreateSavingsWithdrawalDto) {}
