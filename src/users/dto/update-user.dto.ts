import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNotEmpty({ message: 'Please Enter Name User' })
  nameUser: string;
  @IsNotEmpty({ message: 'Please Enter Address' })
  address: string;
  @IsNotEmpty({ message: 'Please Enter Email' })
  email: string;
  @IsNotEmpty({ message: 'Please Enter Avatar' })
  avatar: string[];
  @IsNotEmpty({ message: 'Please Enter Gender' })
  gender: string;
  @IsNotEmpty({ message: 'Please Enter Role' })
  role: string;
  @IsNotEmpty({ message: 'Please Enter Nationality' })
  nation: string;
  @IsNotEmpty({ message: 'Please Enter Phone' })
  phone: number;
  @IsNotEmpty({ message: 'Please Enter totalBook' })
  totalBook: number;
  @IsNotEmpty({ message: 'Please Enter Book' })
  nameBook: string[];
}
