import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { IsArray, IsNotEmpty } from 'class-validator';

export class UpdatePostDto extends PartialType(CreatePostDto) {
    @IsNotEmpty({ message: 'Please Enter Your Name' })
    name: string;
    @IsNotEmpty({ message: 'Please Enter Your Vol' })
    @IsArray({ message: 'Vol có dạng là array' })
    vol: string[];
}
