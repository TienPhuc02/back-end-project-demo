import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateBookDto extends PartialType(CreateBookDto) {
  @IsNotEmpty({ message: 'Please Enter Your nameBook' })
  nameBook: string;
  @IsNotEmpty({ message: 'Please Enter Your nameUser' })
  nameUser: string;
  @IsNotEmpty({ message: 'Please Enter Your descriptionBook' })
  descriptionBook: string;
  @IsNotEmpty({ message: 'Please Enter Your publicYear' })
  publicYear: number;
  @IsNotEmpty({ message: 'Please Enter Your publisher' })
  publisher: string;
  @IsNotEmpty({ message: 'Please Enter Your language' })
  language: string[];
  @IsNotEmpty({ message: 'Please Enter Your genre' })
  genre: string[];
  @IsNotEmpty({ message: 'Please Enter Your thumbnailBook' })
  thumbnailBook: string;
  @IsNotEmpty({ message: 'Please Enter Your totalChapter' })
  totalChapter: number;
  @IsNotEmpty({ message: 'Please Enter Your sliderBook' })
  sliderBook: string[];
  @IsNotEmpty({ message: 'Please Enter Chapter' })
  chapter: string[];
}
