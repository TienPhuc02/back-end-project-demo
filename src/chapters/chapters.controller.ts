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
import { ChaptersService } from './chapters.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { ResponseMessage } from 'src/decorator/customize';

@Controller('chapters')
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  @Post()
  @ResponseMessage('Create Chapter Success!!')
  create(@Body() createChapterDto: CreateChapterDto) {
    return this.chaptersService.create(createChapterDto);
  }

  @Get()
  @ResponseMessage('Get Chapter With Paginate Success!!')
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
  ) {
    return this.chaptersService.findAll(current, pageSize, qs);
  }

  @Get(':id')
  @ResponseMessage('Get Chapter By Id Success!!')
  findOne(@Param('id') id: string) {
    return this.chaptersService.findOne(id);
  }

  // @Post('/bulk-create')
  // @ResponseMessage('Create List Chapter  Success!!')
  // async createListUser(@Body() chapterList: CreateChapterDto[]) {
  //   const newListUser = await this.chaptersService.createListChapter(chapterList);
  //   return newListUser;
  // }
  @Patch(':id')
  @ResponseMessage('Update Chapter By Id Success!!')
  update(@Param('id') id: string, @Body() updateChapterDto: UpdateChapterDto) {
    return this.chaptersService.update(id, updateChapterDto);
  }

  @Delete(':id')
  @ResponseMessage('Remove Chapter By Id Success!!')
  remove(@Param('id') id: string) {
    return this.chaptersService.remove(id);
  }
}
