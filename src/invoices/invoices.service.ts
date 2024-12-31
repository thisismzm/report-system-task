import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from './schemas/invoice.schema';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
  ) {}

  async create(invoiceDto: any): Promise<Invoice> {
    const createdInvoice = new this.invoiceModel(invoiceDto);
    return createdInvoice.save();
  }

  async findAll(filters: any): Promise<Invoice[]> {
    const query: any = {};

    if (filters.startDate && filters.endDate) {
      query.date = {
        $gte: new Date(filters.startDate),
        $lte: new Date(filters.endDate),
      };
    }

    if (filters.customer) {
      query.customer = { $regex: filters.customer, $options: 'i' };
    }

    return this.invoiceModel.find(query).exec();
  }

  async findOneById(id: string): Promise<Invoice> {
    return this.invoiceModel.findById(id).exec();
  }

  async getTotalSalesForDay(date: Date): Promise<number> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const invoices = await this.invoiceModel.aggregate([
      {
        $match: {
          date: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$amount' },
        },
      },
    ]);

    return invoices.length > 0 ? invoices[0].totalSales : 0;
  }

  async getTotalQuantitySoldPerItem(date): Promise<any[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const result = await this.invoiceModel.aggregate([
      {
        $match: {
          date: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        },
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.sku',
          totalQuantitySold: { $sum: '$items.qt' },
        },
      },
      { $project: { _id: 0, sku: '$_id', totalQuantitySold: 1 } },
    ]);

    return result;
  }
}
