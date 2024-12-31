import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailTransportService {
  getTransport() {
    return nodemailer.createTransport({
      name: 'test',
      version: '0.1.0',
      send: (mail) => {
        console.log(mail.data);
      },
    });
  }
}
