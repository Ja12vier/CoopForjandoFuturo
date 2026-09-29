import { IsOptional, IsString, IsNumber, IsBoolean, IsEmail, IsNotEmpty, IsEnum, Max, MaxLength, Length } from "class-validator";

enum levelRisk{
  UNKNOWN = 'UNKNOWN',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  VERY_HIGH = 'VERY_HIGH',
}

enum Status{
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELINQUENT = 'DELINQUENT',
  RETIRED = 'RETIRED',
}

export class CreateUsersClientDto {
    @IsString()
    @IsOptional()
    numberAccount!: string;

    @IsString()
    name!: string;

    @IsString()
    @Length(12)
    @IsNotEmpty()
    @IsOptional()
    phone?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @Length(13)
    numberCard!: string;

    @IsOptional()
    @IsNumber()
    balanceCurrent?: number;

    @IsOptional()
    @IsNumber()
    retireTotal?: number;

    @IsOptional()
    @IsNumber()
    activeLoans?: number;

    @IsString()
    address!: string;

    @IsNumber()
    contributions!: number;

    @IsOptional()
    @IsNumber()
    totalLoans?: number;

    @IsEnum(levelRisk)
    @IsOptional()
    levelRisk?:string='UNKNOWN';

    @IsNotEmpty()
    dateEntry!: Date;

    @IsEnum(Status)
    @IsOptional()
    state?:string='ACTIVE';

    @IsOptional()
    createdAt?: Date;

    @IsOptional()
    updatedAt?: Date;

    @IsNumber()
    userId!: number;
    
}
