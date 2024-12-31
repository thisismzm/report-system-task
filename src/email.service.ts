import { Injectable } from '@nestjs/common';
import { EmailTransportService } from './email-transport.service';

@Injectable()
export class EmailService {
  constructor(
    private readonly emailTransportService: EmailTransportService
  ) {

  }

  async sendEmail(data) {
    try {
      const { to, subject, text } = data;
      let transport = this.emailTransportService.getTransport();
      await transport.sendMail({
        from: 'mynestjsapp@localhost.local',
        to,
        subject,
        text,
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
