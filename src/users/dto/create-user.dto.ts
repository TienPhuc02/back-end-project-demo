import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Please Enter Name User' })
  userName: string;
  @IsNotEmpty({ message: 'Please Enter Address' })
  address: string;
  @IsNotEmpty({ message: 'Please Enter firstName' })
  firstName: string;
  @IsNotEmpty({ message: 'Please Enter lastName' })
  lastName: string;
  @IsNotEmpty({ message: 'Please Enter Email' })
  emailAddress: string;
  @IsNotEmpty({ message: 'Please Enter Role' })
  role: string;
  @IsNotEmpty({ message: 'Please Enter Avatar' })
  avatar: string[];
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
  userName: string;
  @IsNotEmpty({
    message: 'Please Enter Your emailAddressAddress',
  })
  emailAddress: string;
  @IsNotEmpty({ message: 'Please Enter firstName' })
  firstName: string;
  @IsNotEmpty({ message: 'Please Enter lastName' })
  lastName: string;
  @IsNotEmpty({
    message: 'Please Enter Your Password',
  })
  password: string;
  @IsNotEmpty({
    message: 'Please Enter Your passwordConfirm',
  })
  passwordConfirm: string;
  @IsNotEmpty({
    message: 'Please Enter Your Phone',
  })
  phone: number;
  @IsNotEmpty({
    message: 'Please Enter Your Address',
  })
  address: string;
}
