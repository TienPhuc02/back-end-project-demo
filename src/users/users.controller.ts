import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';

import { ResponseMessage, User } from 'src/decorator/customize';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from './user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ResponseMessage('Create User Success!!')
  create(@Body() createUserDto: CreateUserDto,@User() user: IUser) {
    return this.usersService.create(createUserDto,user);
  }

  @Get()
  @ResponseMessage('Get User With Paginate Success!!')
  findAll(
    @Query('current') current: number,
    @Query('pageSize') pageSize: number,
    @Query() qs: string,
  ) {
    return this.usersService.findAll(current, pageSize, qs);
  }

  @Get(':id')
  @ResponseMessage('Get User By Id Success!!')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
  @Patch(':id')
  @ResponseMessage('Update User By Id Success!!')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @User() user: IUser,
  ) {
    return this.usersService.update(id, updateUserDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Remove User By Id Success!!')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.usersService.remove(id, user);
  }
}
