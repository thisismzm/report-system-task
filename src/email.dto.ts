import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';

@UseInterceptors(ClassSerializerInterceptor)
export class EmailDto {
  to: string;
  subject: string;
  text: string;
}
