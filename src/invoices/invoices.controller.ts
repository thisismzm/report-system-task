import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  async create(@Body() invoiceDto: any) {
    return this.invoicesService.create(invoiceDto);
  }

  @Get()
  async findAll(@Query() query: any) {
    return this.invoicesService.findAll(query);
  }

  @Get(':id')
  async getInvoiceById(@Param('id') id: string) {
    return this.invoicesService.findOneById(id);
  }
}
