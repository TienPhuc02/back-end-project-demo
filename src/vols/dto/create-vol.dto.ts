import { IsArray, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateVolDto {
  @IsNotEmpty({ message: 'Please Enter Your Name' })
  name: string;
//   @IsNotEmpty({ message: 'Please Enter Your Post' })
  @IsArray({ message: 'Post có dạng là array' })
  post: mongoose.Schema.Types.ObjectId[];
}

