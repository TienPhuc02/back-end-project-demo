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
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ResponseMessage } from 'src/decorator/customize';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ResponseMessage('Create Post Success!!')
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  @ResponseMessage('Get Post With Paginate Success!!')
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
  ) {
    return this.postsService.findAll(current, pageSize, qs);
  }

  @Get(':id')
  @ResponseMessage('Get Post By Id Success!!')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  // @Post('/bulk-create')
  // @ResponseMessage('Create List Post  Success!!')
  // async createListUser(@Body() postList: CreatePostDto[]) {
  //   const newListUser = await this.postsService.createListPost(postList);
  //   return newListUser;
  // }
  @Patch(':id')
  @ResponseMessage('Update Post By Id Success!!')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @ResponseMessage('Remove Post By Id Success!!')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
