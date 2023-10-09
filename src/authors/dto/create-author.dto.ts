import {  IsNotEmpty } from 'class-validator';

export class CreateAuthorDto {
  @IsNotEmpty({ message: 'Please Enter Name Author' })
  nameAuthor: string;
  @IsNotEmpty({ message: 'Please Enter Address' })
  address: string;
  @IsNotEmpty({ message: 'Please Enter Avatar' })
  avatar: string;
  @IsNotEmpty({ message: 'Please Enter Gender' })
  gender: string;
  @IsNotEmpty({ message: 'Please Enter Nationality' })
  nation: string;
  @IsNotEmpty({ message: 'Please Enter Phone' })
  phone: number;
}
