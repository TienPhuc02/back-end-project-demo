import { IsArray, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateChapterDto {
  @IsNotEmpty({ message: 'Please Enter Your Name' })
  name: string | string[];
  @IsNotEmpty({ message: 'Please Enter Your Author' })
  author: string;
  // @IsNotEmpty({ message: 'Please Enter Your Vol' })
  @IsArray({ message: 'Vol có dạng là array' })
  vol: mongoose.Schema.Types.ObjectId[];
}
