import { IsNotEmpty } from 'class-validator';

export class CreateVolDto {
  @IsNotEmpty({ message: 'Please Enter Your Name' })
  name: string;
}

