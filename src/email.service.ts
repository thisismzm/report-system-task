import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  async sendEmail(data) {
    try {
      const { to, subject, text } = data;

      let transporter = nodemailer.createTransport({
        name: 'test',
        version: '0.1.0',
        send: (mail) => {
          console.log(mail.data);
        },
      });

      await transporter.sendMail({
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
