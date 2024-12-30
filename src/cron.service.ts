import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EmailProducerService } from './email-producer.service';
import { EmailDtoFactory } from './email.dto.factory';

@Injectable()
export class CronService {
  constructor(
    private readonly emailProducerService: EmailProducerService,
    private readonly emailDtoFactory: EmailDtoFactory
  ) {}

  @Cron('*/30 * * * *')
  async handleDailyCron() {
    console.log('This will run every day at 12 AM');
    const emailDto = this.emailDtoFactory.create(
      "Report",
      "Report Body",
      "mzmoghadam72@gmail.com"
    );
    await this.emailProducerService.sendEmail(emailDto);
  }
}
