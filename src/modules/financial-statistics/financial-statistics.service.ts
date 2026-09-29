import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinancialStatistics } from './entities/financial-statistics.entity';
import { CreateFinancialStatisticsDto } from './dto/create-financial-statistics.dto';
import { UpdateFinancialStatisticsDto } from './dto/update-financial-statistics.dto';

@Injectable()
export class FinancialStatisticsService {
  constructor(
    @InjectRepository(FinancialStatistics)
    private readonly financialStatisticsRepository: Repository<FinancialStatistics>
  ) {}

  async create(createDto: CreateFinancialStatisticsDto) {
    const stats = this.financialStatisticsRepository.create(createDto);
    await this.financialStatisticsRepository.save(stats);
    return stats;
  }

  async findAll() {
    return await this.financialStatisticsRepository.find();
  }

  async findOne(id: number) {
    const stats = await this.financialStatisticsRepository.findOneBy({ id });
    if (!stats) throw new NotFoundException(`FinancialStatistics with id ${id} not found`);
    return stats;
  }

  async update(id: number, updateDto: UpdateFinancialStatisticsDto) {
    const stats = await this.financialStatisticsRepository.preload({ id, ...updateDto });
    if (!stats) throw new NotFoundException(`FinancialStatistics with id ${id} not found`);
    await this.financialStatisticsRepository.save(stats);
    return stats;
  }

  async remove(id: number) {
    const result = await this.financialStatisticsRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`FinancialStatistics with id ${id} not found`);
    return `This action removes a #${id} financialStatistics`;
  }
}
