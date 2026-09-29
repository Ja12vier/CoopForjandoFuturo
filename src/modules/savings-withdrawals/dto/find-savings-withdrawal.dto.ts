import { IsDateString, IsEnum, IsNumber, IsOptional } from "class-validator";
import { TypeSavingsWithdrawal } from "./create-savings-withdrawal.dto";
import { Type } from "class-transformer";


export class FindSavingsWithdrawalDto {

    @IsEnum(TypeSavingsWithdrawal)
    @IsOptional()
    type?: TypeSavingsWithdrawal;

    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    userClientId?: number;
}