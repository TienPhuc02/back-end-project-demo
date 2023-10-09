import { IsNotEmpty } from 'class-validator';

export class CreateLineDto {
  @IsNotEmpty({ message: 'Please Enter Your Name' })
  name: string;
  @IsNotEmpty({ message: 'Please Enter Your NameTransForm' })
  nameTransform: string;
  @IsNotEmpty({ message: 'Please Enter Your Total' })
  total: number;
  //   @IsNotEmpty({ message: 'Please Enter Your Name' })
  thumbnail: string;
  //   @IsNotEmpty({ message: 'Please Enter Your Name' })
  slider: string[];
}
