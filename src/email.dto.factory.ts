import { Injectable } from '@nestjs/common';
import { EmailDto } from './email.dto';

@Injectable()
export class EmailDtoFactory {
  create(to: string, subject: string, text: string): EmailDto {
    const emailDto = new EmailDto();
    emailDto.to = to;
    emailDto.subject = subject;
    emailDto.text = text;

    return emailDto;
  }
}
