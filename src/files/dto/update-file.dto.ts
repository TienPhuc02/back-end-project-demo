import { PartialType } from '@nestjs/mapped-types';
import { CreateFileDto } from './create-file.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateFileDto extends PartialType(CreateFileDto) {
  @IsNotEmpty({ message: 'Please Enter Your Image' })
  filename: string;
}
