import { IsArray, IsNotEmpty } from "class-validator";

export class CreateAuthorDto {
    @IsNotEmpty({ message: 'Please Enter Your Name' })
    author: string ;
    @IsNotEmpty({ message: 'Please Enter Your Address' })
    address: string;
    // @IsNotEmpty({ message: 'Please Enter Your Chapter' })
    @IsArray({ message: 'Vol có dạng là array' })
    chapter: string[];
}
