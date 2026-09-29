import { Type } from "class-transformer";
import { IsDate, IsDateString, IsEnum, IsNumber, IsOptional, Min } from "class-validator";
import { Payment } from "./create-loan.dto";





export class CalculateLoanDto{
    
    @Type(()=>Number)
    @IsNumber()
    amount!:number
    
    @Type(()=>Number)
    @IsNumber()
    @Min(0)
    rate!:number
    
    @Type(()=>Number)
    @IsNumber()
    @Min(1)
    quota!:number
    
    @IsEnum(Payment)
    payment!:Payment
    
    @Type(()=>Date)
    @IsOptional()
    @IsDate()
    dateStart?:Date

    
}