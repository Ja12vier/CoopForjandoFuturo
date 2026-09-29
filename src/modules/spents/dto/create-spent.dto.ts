import { IsNumber, IsString, IsOptional, IsDate } from 'class-validator';

export class CreateSpentDto {
  @IsNumber()
  amount!: number;

  @IsString()
  description!: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsDate()
  date!: Date;

  @IsNumber()
  userId!: number;

  @IsDate()
  period!: Date;
}
