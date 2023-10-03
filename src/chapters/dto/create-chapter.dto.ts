import { IsNotEmpty } from 'class-validator';

export class CreateChapterDto {
  @IsNotEmpty({ message: 'Please Enter Your Name' })
  name: string;
  @IsNotEmpty({ message: 'Please Enter Your Author' })
  author: string;
}
