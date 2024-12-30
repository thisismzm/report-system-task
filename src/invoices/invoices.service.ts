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

  async findAll(): Promise<Invoice[]> {
    return this.invoiceModel.find().exec();
  }

  async getDailySalesSummary(): Promise<any> {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
  
    return this.invoiceModel.aggregate([
      {
        $match: {
          date: { $gte: twentyFourHoursAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' },
          },
          totalAmount: { $sum: '$amount' },
          totalItems: { $sum: { $sum: '$items.qt' } },
          invoiceCount: { $count: {} },
        },
      },
      {
        $project: {
          date: '$_id',
          totalAmount: 1,
          totalItems: 1,
          invoiceCount: 1,
          _id: 0,
        },
      },
    ]).exec();
  }
}
