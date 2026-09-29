import { PartialType } from '@nestjs/mapped-types';
import { CreateSpentDto } from './create-spent.dto';

export class UpdateSpentDto extends PartialType(CreateSpentDto) {}
