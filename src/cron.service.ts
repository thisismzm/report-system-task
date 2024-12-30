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
    private readonly invoicesService: InvoicesService
  ) {}

  @Cron('0 0 * * *')
  async handleDailyCron() {
    let dailySummary = await this.invoicesService.getDailySalesSummary();
    console.log(dailySummary);
    if (dailySummary.length > 0) {
      const emailDto = this.emailDtoFactory.create(
        "mzmoghadam72@gmail.com",
        "Report",
        `Total Amout: ${dailySummary.totalAmount}, totalItems: ${dailySummary.totalItems}, invoiceCount: ${dailySummary.invoiceCount}`
      );
      await this.emailProducerService.sendEmail(emailDto);
    }
  }
}
