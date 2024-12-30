import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron.service';
import { EmailProducerService } from './email-producer.service';
import { EmailDtoFactory } from './email.dto.factory';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [CronService, EmailProducerService, EmailDtoFactory],
})
export class CronModule {}
