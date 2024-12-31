import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EmailProducerService } from './email-producer.service';
import { EmailDtoFactory } from './email.dto.factory';
import { InvoicesService } from './invoices/invoices.service';

@Injectable()
export class CronService {
  constructor(
    private readonly emailProducerService: EmailProducerService,
    private readonly emailDtoFactory: EmailDtoFactory,
    private readonly invoicesService: InvoicesService,
  ) {}

  @Cron('0 0 * * *')
  async handleDailyCron() {
    const date = new Date();
    const totalSalesForDay =
      await this.invoicesService.getTotalSalesForDay(date);
    const totalQuantitySoldPerItem =
      await this.invoicesService.getTotalQuantitySoldPerItem(date);
    let text = `${date.getFullYear()}/${date.getMonth()}/${date.getDay()} \n`;
    text += `Total Sales Amount: ${totalSalesForDay} \n`;
    totalQuantitySoldPerItem.forEach((element) => {
      text += `SKU: ${element.sku}, Total Quantity Sold: ${element.totalQuantitySold} \n`;
    });
    const emailDto = this.emailDtoFactory.create(
      'mzmoghadam72@gmail.com',
      'Report',
      text,
    );
    await this.emailProducerService.sendEmail(emailDto);
  }
}
