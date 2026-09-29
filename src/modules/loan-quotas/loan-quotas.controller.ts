import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LoanQuotasService } from './loan-quotas.service';
import { CreateLoanQuotaDto } from './dto/create-loan-quota.dto';
import { UpdateLoanQuotaDto } from './dto/update-loan-quota.dto';

@Controller('loan-quotas')
export class LoanQuotasController {
  constructor(private readonly service: LoanQuotasService) {}

  @Post()
  create(@Body() dto: CreateLoanQuotaDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLoanQuotaDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
