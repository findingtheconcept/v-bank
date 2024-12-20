import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';

import { IsString, IsEmail, IsNumber, Min, Max } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Customer } from './entities/customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Type } from 'class-transformer';

export class CreateCustomerDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @Type(() => Number)
  @IsNumber()
  @Min(-10000000000)
  @Max(100000000000)
  debitBalance: number;

  @Type(() => Number)
  @IsNumber()
  @Min(-10000000000)
  @Max(100000000000)
  creditBalance: number;
}

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}

export class UpdateBalanceDto {
  @IsNumber()
  debitBalance: number;

  @IsNumber()
  creditBalance: number;
}

@Controller('customers')
export class AppController {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  @Get()
  async getAll(): Promise<Customer[]> {
    return await this.customerRepository.find();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<Customer> {
    return await this.customerRepository.findOneBy({ id });
  }

  @Post()
  async create(@Body() createDto: CreateCustomerDto): Promise<Customer> {
    const customer = this.customerRepository.create(createDto);
    return await this.customerRepository.save(customer);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCustomerDto,
  ): Promise<string> {
    await this.customerRepository.update(id, updateDto);
    return `Customer with ID ${id} has been updated`;
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<string> {
    await this.customerRepository.delete(id);
    return `Customer with ID ${id} has been deleted`;
  }

  @Patch(':id/balance')
  async updateBalance(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBalanceDto: UpdateBalanceDto,
  ): Promise<Customer> {
    const customer = await this.customerRepository.findOneBy({ id });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    customer.debitBalance += updateBalanceDto.debitBalance;
    customer.creditBalance += updateBalanceDto.creditBalance;

    return await this.customerRepository.save(customer);
  }
}
