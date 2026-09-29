import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { SavingsWithdrawalsService } from './savings-withdrawals.service';
import { CreateSavingsWithdrawalDto } from './dto/create-savings-withdrawal.dto';
import { UpdateSavingsWithdrawalDto } from './dto/update-savings-withdrawal.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../auth/Enums/role.enum';
import { FindSavingsWithdrawalDto } from './dto/find-savings-withdrawal.dto';

@Controller('savings-withdrawals')
export class SavingsWithdrawalsController {
  constructor(private readonly service: SavingsWithdrawalsService) {}

  @Post()
  create(@Body() dto: CreateSavingsWithdrawalDto) {
    return this.service.create(dto);
  }

  //   Obtener todos sin filtros
  //  GET /savings-withdrawals

  //  Filtrar solo por tipo
  //  GET /savings-withdrawals?type=SAVINGS

  //  Filtrar por rango de fechas
  //  GET /savings-withdrawals?startDate=2024-01-01&endDate=2024-12-31

  //  Filtrar por cliente específico
  //  GET /savings-withdrawals?userClientId=123

  //  Combinar múltiples filtros
  //  GET /savings-withdrawals?type=SAVINGS&startDate=2024-01-01&userClientId=123

  @Get()
  findAll(@Query() query:FindSavingsWithdrawalDto) {
    return this.service.findAll(
      query.type,
      query.startDate ? new Date(query.startDate) :undefined,
      query.endDate ? new Date(query.endDate) :undefined,
      query.userClientId
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }
  

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateSavingsWithdrawalDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

 // Added method to get history by userClientId
  @Get(':id/user-cliente-history')
  findHistoryBy (@Param('id') id: string) {
    return this.service.findHistoryBy(+id);
  }
}

