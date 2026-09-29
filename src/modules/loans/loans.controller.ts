import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { CalculateLoanDto } from './dto/calculate-loan.dto';
import { RoleGuard } from '../auth/guards/role.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../auth/Enums/role.enum';
import { CalculationLoanTypeService } from './services/calculation-loan-type/calculation-loan-type.service';

@Controller('loans')
export class LoansController {
  constructor(
    private readonly loansService: LoansService,
    private readonly calculationLoanTypeService: CalculationLoanTypeService
  ) {}


  @Get('simulate-loan')
  calculateLoan(@Query() query:CalculateLoanDto) {
    return this.calculationLoanTypeService.calculatorsLoanFixed(query.amount, query.rate, query.quota, query.payment, query.dateStart);
  }

  @Post()
  create(@Body() createLoanDto: CreateLoanDto) {
    return this.loansService.create(createLoanDto);
  }

  @Get()
  findAll() {
    return this.loansService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loansService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateLoanDto: UpdateLoanDto) {
    return this.loansService.update(+id, updateLoanDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.loansService.remove(+id);
  }
}
