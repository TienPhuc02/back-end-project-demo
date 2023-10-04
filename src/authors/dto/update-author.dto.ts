import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthorDto } from './create-author.dto';
import { IsArray, IsNotEmpty } from 'class-validator';

export class UpdateAuthorDto extends PartialType(CreateAuthorDto) {
  @IsNotEmpty({ message: 'Please Enter Your Name' })
  author: string;
  @IsNotEmpty({ message: 'Please Enter Your Address' })
  address: string;
  // @IsNotEmpty({ message: 'Please Enter Your Chapter' })
  @IsArray({ message: 'chapter có dạng là array' })
  chapter: string[];
}
