import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateVolDto {
  @IsNotEmpty({ message: 'Please Enter Your Name' })
  name: string;
  @IsNotEmpty({ message: 'Please Enter Your Post' })
  @IsArray({ message: 'Post có dạng là array' })
  post: string[];
}

