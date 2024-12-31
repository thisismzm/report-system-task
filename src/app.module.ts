import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InvoicesModule } from './invoices/invoices.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CronModule } from './cron.module';
import { EmailProducerService } from './email-producer.service';
import { EmailService } from './email.service';
import { EmailTransportService } from './email-transport.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        dbName: configService.get<string>('MONGODB_DATABASE'),
      }),
      inject: [ConfigService],
    }),
    CronModule,
    InvoicesModule
  ],
  controllers: [AppController],
  providers: [AppService, EmailProducerService, EmailService, EmailTransportService],
})
export class AppModule {}
