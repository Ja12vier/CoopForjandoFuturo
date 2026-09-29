import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Income } from './entities/income.entity';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';

@Injectable()
export class IncomesService {
  constructor(
    @InjectRepository(Income)
    private readonly incomeRepository: Repository<Income>
  ) {}

  async create(createDto: CreateIncomeDto) {
    const income = this.incomeRepository.create(createDto);
    await this.incomeRepository.save(income);
    return income;
  }

  async findAll() {
    return await this.incomeRepository.find();
  }

  async findOne(id: number) {
    const income = await this.incomeRepository.findOneBy({ id });
    if (!income) throw new NotFoundException(`Income with id ${id} not found`);
    return income;
  }

  async update(id: number, updateDto: UpdateIncomeDto) {
    const income = await this.incomeRepository.preload({ id, ...updateDto });
    if (!income) throw new NotFoundException(`Income with id ${id} not found`);
    await this.incomeRepository.save(income);
    return income;
  }

  async remove(id: number) {
    const result = await this.incomeRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Income with id ${id} not found`);
    return `This action removes a #${id} income`;
  }
}
