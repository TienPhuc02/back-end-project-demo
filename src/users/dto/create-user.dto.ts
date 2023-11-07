import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Please Enter Name User' })
  nameUser: string;
  @IsNotEmpty({ message: 'Please Enter Address' })
  address: string;
  @IsNotEmpty({ message: 'Please Enter Email' })
  email: string;
  @IsNotEmpty({ message: 'Please Enter Role' })
  role: string;
  @IsNotEmpty({ message: 'Please Enter Avatar' })
  avatar: string[];
  @IsNotEmpty({ message: 'Please Enter Gender' })
  gender: string;
  @IsNotEmpty({ message: 'Please Enter Nationality' })
  nation: string;
  @IsNotEmpty({ message: 'Please Enter Phone' })
  phone: number;
  @IsNotEmpty({ message: 'Please Enter totalBook' })
  totalBook: number;
  @IsNotEmpty({ message: 'Please Enter Book' })
  nameBook: string[];
}
export class RegisterUserDto {
  @IsNotEmpty({
    message: 'Please Enter Your Name',
  })
  nameUser: string;
  @IsNotEmpty({
    message: 'Please Enter Your Email',
  })
  email: string;
  @IsNotEmpty({
    message: 'Please Enter Your Password',
  })
  password: string;
  @IsNotEmpty({
    message: 'Please Enter Your Address',
  })
  address: string;
}
