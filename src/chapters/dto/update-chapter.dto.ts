import { PartialType } from '@nestjs/mapped-types';
import { CreateChapterDto } from './create-chapter.dto';
import { IsArray, IsNotEmpty } from 'class-validator';

export class UpdateChapterDto extends PartialType(CreateChapterDto) {
  @IsNotEmpty({message:"Please Enter Your Title Chapter" })
  titleChapter: string;
  @IsNotEmpty({message:"Please Enter Your nameAuthor" })
  nameAuthor: string;
  @IsNotEmpty({message:"Please Enter Your nameBook" })
  nameBook: string;
  @IsNotEmpty({message:"Please Enter Your descriptionChapter" })
  descriptionChapter: string;
  @IsNotEmpty({message:"Please Enter Your publicYear" })
  publicYear: number;
  @IsNotEmpty({message:"Please Enter Your totalVol" })
  totalVol: number;
  @IsNotEmpty({message:"Please Enter Your Vol" })
  @IsArray({message:"Array Must Be Array"})
  vol: string[];
}
