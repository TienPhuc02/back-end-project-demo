import { PartialType } from '@nestjs/mapped-types';
import { CreateLineDto } from './create-line.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateLineDto extends PartialType(CreateLineDto) {
  @IsNotEmpty({ message: 'Please Enter Your Name' })
  name: string;
  @IsNotEmpty({ message: 'Please Enter Your Name' })
  nameTransform: string;
  @IsNotEmpty({ message: 'Please Enter Your Name' })
  total: number;
  @IsNotEmpty({ message: 'Please Enter Your Name' })
  thumbnail: string;
  @IsNotEmpty({ message: 'Please Enter Your Name' })
  slider: string[];
}
