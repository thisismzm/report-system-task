import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron.service';
import { EmailProducerService } from './email-producer.service';
import { EmailDtoFactory } from './email.dto.factory';
import { InvoicesService } from './invoices/invoices.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice, InvoiceSchema } from './invoices/schemas/invoice.schema';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      {
        name: Invoice.name,
        schema: InvoiceSchema,
      },
    ]),
  ],
  providers: [
    CronService,
    EmailProducerService,
    EmailDtoFactory,
    InvoicesService,
  ],
})
export class CronModule {}
