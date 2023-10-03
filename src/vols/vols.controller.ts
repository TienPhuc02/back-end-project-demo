import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VolsService } from './vols.service';
import { CreateVolDto } from './dto/create-vol.dto';
import { UpdateVolDto } from './dto/update-vol.dto';

@Controller('vols')
export class VolsController {
  constructor(private readonly volsService: VolsService) {}

  @Post()
  create(@Body() createVolDto: CreateVolDto) {
    return this.volsService.create(createVolDto);
  }

  @Get()
  findAll() {
    return this.volsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.volsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVolDto: UpdateVolDto) {
    return this.volsService.update(+id, updateVolDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.volsService.remove(+id);
  }
}
