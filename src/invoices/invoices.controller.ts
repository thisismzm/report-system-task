import { Controller, Get, Post, Body } from '@nestjs/common';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  async create(@Body() invoiceDto: any) {
    return this.invoicesService.create(invoiceDto);
  }

  @Get()
  async findAll() {
    return this.invoicesService.findAll();
  }
}
