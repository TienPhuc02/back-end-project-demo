import { Injectable } from '@nestjs/common';
import { CreateVolDto } from './dto/create-vol.dto';
import { UpdateVolDto } from './dto/update-vol.dto';

@Injectable()
export class VolsService {
  create(createVolDto: CreateVolDto) {
    return 'This action adds a new vol';
  }

  findAll() {
    return `This action returns all vols`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vol`;
  }

  update(id: number, updateVolDto: UpdateVolDto) {
    return `This action updates a #${id} vol`;
  }

  remove(id: number) {
    return `This action removes a #${id} vol`;
  }
}
