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
import { LinesService } from './lines.service';
import { CreateLineDto } from './dto/create-line.dto';
import { UpdateLineDto } from './dto/update-line.dto';
import { ResponseMessage } from 'src/decorator/customize';

@Controller('lines')
export class LinesController {
  constructor(private readonly linesService: LinesService) {}

  @Post()
  @ResponseMessage('Create Line Success!!')
  create(@Body() createLineDto: CreateLineDto) {
    return this.linesService.create(createLineDto);
  }

  @Get()
  @ResponseMessage('Get Line With Paginate Success!!')
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
  ) {
    return this.linesService.findAll(current, pageSize, qs);
  }

  @Get(':id')
  @ResponseMessage('Get Line By Id Success!!')
  findOne(@Param('id') id: string) {
    return this.linesService.findOne(id);
  }

  // @Post('/bulk-create')
  // @ResponseMessage('Create List Line  Success!!')
  // async createListUser(@Body() lineList: CreateLineDto[]) {
  //   const newListUser = await this.linesService.createListLine(lineList);
  //   return newListUser;
  // }
  @Patch(':id')
  @ResponseMessage('Update Line By Id Success!!')
  update(@Param('id') id: string, @Body() updateLineDto: UpdateLineDto) {
    return this.linesService.update(id, updateLineDto);
  }

  @Delete(':id')
  @ResponseMessage('Remove Line By Id Success!!')
  remove(@Param('id') id: string) {
    return this.linesService.remove(id);
  }
}
