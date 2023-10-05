import { IsArray, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty({ message: 'Please Enter Your Name' })
  name: string;
  @IsNotEmpty({ message: 'Please Enter Your Vol' })
  @IsArray({ message: 'Vol có dạng là array' })
  vol: string[];
}

