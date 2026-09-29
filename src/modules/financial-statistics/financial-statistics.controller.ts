import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FinancialStatisticsService } from './financial-statistics.service';
import { CreateFinancialStatisticsDto } from './dto/create-financial-statistics.dto';
import { UpdateFinancialStatisticsDto } from './dto/update-financial-statistics.dto';

@Controller('financial-statistics')
export class FinancialStatisticsController {
  constructor(private readonly service: FinancialStatisticsService) {}

  @Post()
  create(@Body() dto: CreateFinancialStatisticsDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateFinancialStatisticsDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
