import { PartialType } from '@nestjs/mapped-types';
import { CreateVolDto } from './create-vol.dto';
import { IsArray, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class UpdateVolDto extends PartialType(CreateVolDto) {
  @IsNotEmpty({ message: 'Please Enter Your Name' })
  name: string;
//   @IsNotEmpty({ message: 'Please Enter Your Post' })
  @IsArray({ message: 'Post có dạng là array' })
  post: mongoose.Schema.Types.ObjectId[];
}
