import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { VolsService } from './vols.service';
import { CreateVolDto } from './dto/create-vol.dto';
import { UpdateVolDto } from './dto/update-vol.dto';
import { ResponseMessage } from 'src/decorator/customize';

@Controller('vols')
export class VolsController {
  constructor(private readonly volsService: VolsService) {}
  @Post()
  @ResponseMessage('Create Vol Success!!')
  create(@Body() createVolDto: CreateVolDto) {
    return this.volsService.create(createVolDto);
  }

  @Get()
  @ResponseMessage('Get Vol With Paginate Success!!')
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
  ) {
    return this.volsService.findAll(current, pageSize, qs);
  }

  @Get(':id')
  @ResponseMessage('Get Vol By Id Success!!')
  findOne(@Param('id') id: string) {
    return this.volsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update Vol By Id Success!!')
  update(@Param('id') id: string, @Body() updateVolDto: UpdateVolDto) {
    return this.volsService.update(id, updateVolDto);
  }

  @Delete(':id')
  @ResponseMessage('Remove Vol By Id Success!!')
  remove(@Param('id') id: string) {
    return this.volsService.remove(id);
  }
}
