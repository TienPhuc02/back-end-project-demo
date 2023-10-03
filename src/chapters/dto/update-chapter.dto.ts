import { PartialType } from '@nestjs/mapped-types';
import { CreateChapterDto } from './create-chapter.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateChapterDto extends PartialType(CreateChapterDto) {
  @IsNotEmpty({ message: 'Please Enter Your Name' })
  name: string;
  @IsNotEmpty({ message: 'Please Enter Your Author' })
  author: string;
}
