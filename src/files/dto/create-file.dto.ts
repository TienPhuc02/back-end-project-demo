import { IsNotEmpty } from 'class-validator';

export class CreateFileDto {
  @IsNotEmpty({ message: 'Please Enter Your Image' })
  filename: string;
}
