import { PartialType } from '@nestjs/mapped-types';
import { CreateChapterDto } from './create-chapter.dto';
import { IsArray, IsNotEmpty } from 'class-validator';

export class UpdateChapterDto extends PartialType(CreateChapterDto) {
  @IsNotEmpty({ message: 'Please Enter Your Name' })
  name: string | string[];
  @IsNotEmpty({ message: 'Please Enter Your Vol' })
  @IsArray({ message: 'Vol có dạng là array' })
  vol: string[];
}
