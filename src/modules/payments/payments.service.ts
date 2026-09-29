import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>
  ) {}

  async create(createDto: CreatePaymentDto) {
    const payment = this.paymentRepository.create(createDto);
    await this.paymentRepository.save(payment);
    return payment;
  }

  async findAll() {
    return await this.paymentRepository.find();
  }

  async findOne(id: number) {
    const payment = await this.paymentRepository.findOneBy({ id });
    if (!payment) throw new NotFoundException(`Payment with id ${id} not found`);
    return payment;
  }

  async update(id: number, updateDto: UpdatePaymentDto) {
    const payment = await this.paymentRepository.preload({ id, ...updateDto });
    if (!payment) throw new NotFoundException(`Payment with id ${id} not found`);
    await this.paymentRepository.save(payment);
    return payment;
  }

  async remove(id: number) {
    const result = await this.paymentRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Payment with id ${id} not found`);
    return `This action removes a #${id} payment`;
  }
}
