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

import { ResponseMessage } from 'src/decorator/customize';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post()
  @ResponseMessage('Create Author Success!!')
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorsService.create(createAuthorDto);
  }

  @Get()
  @ResponseMessage('Get Author With Paginate Success!!')
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
  ) {
    return this.authorsService.findAll(current, pageSize, qs);
  }

  @Get(':id')
  @ResponseMessage('Get Author By Id Success!!')
  findOne(@Param('id') id: string) {
    return this.authorsService.findOne(id);
  }

  // @Post('/bulk-create')
  // @ResponseMessage('Create List Author  Success!!')
  // async createListUser(@Body() authorList: CreateAuthorDto[]) {
  //   const newListUser = await this.authorsService.createListAuthor(authorList);
  //   return newListUser;
  // }
  @Patch(':id')
  @ResponseMessage('Update Author By Id Success!!')
  update(@Param('id') id: string, @Body() updateAuthorDto: UpdateAuthorDto) {
    return this.authorsService.update(id, updateAuthorDto);
  }

  @Delete(':id')
  @ResponseMessage('Remove Author By Id Success!!')
  remove(@Param('id') id: string) {
    return this.authorsService.remove(id);
  }
}
