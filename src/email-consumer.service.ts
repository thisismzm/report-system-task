import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import * as nodemailer from 'nodemailer';
import { Payload, Ctx, RmqContext } from '@nestjs/microservices';

@Injectable()
export class EmailConsumerService implements OnModuleInit {
  private client: ClientProxy;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const rabbitmqUrl = this.configService.get<string>('RABBITMQ_URL');
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [rabbitmqUrl],
        queue: 'email_queue',
        queueOptions: {
          durable: true,
        },
      },
    });

    await this.client.connect();
  }

  async handleEmail(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      const { to, subject, text } = data;

      let transporter = nodemailer.createTransport({
        transport: {
          jsonTransport: true,
        },
      });

      let info = await transporter.sendMail({
        from: 'mynestjsapp@localhost.local',
        to,
        subject,
        text,
      });

      console.log(`Email sent to ${to}`);
      console.log(info);
      channel.ack(message);
    } catch (error) {
      console.error('Error sending email:', error);
      channel.nack(message);
    }
  }
}
