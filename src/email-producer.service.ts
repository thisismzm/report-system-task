import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { EmailDto } from './email.dto';

@Injectable()
export class EmailProducerService {
  private client: ClientProxy;

  constructor(private readonly configService: ConfigService) {
    const rabbitmqUrl = this.configService.get<string>('RABBITMQ_URL');
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [rabbitmqUrl],
        queue: 'email_queue',
        queueOptions: {
          durable: false,
        },
      },
    });
  }

  async sendEmail(emailDto: EmailDto) {
    return this.client.emit('send_email', emailDto).toPromise();
  }
}
