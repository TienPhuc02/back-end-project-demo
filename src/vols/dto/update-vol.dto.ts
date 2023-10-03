import { PartialType } from '@nestjs/mapped-types';
import { CreateVolDto } from './create-vol.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateVolDto extends PartialType(CreateVolDto) {
  @IsNotEmpty({ message: 'Please Enter Your Name' })
  name: string;
}
