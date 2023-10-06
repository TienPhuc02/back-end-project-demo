import { Injectable } from '@nestjs/common';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { FileDocument } from './schema/file.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(File.name) private fileModel: SoftDeleteModel<FileDocument>,
  ) {}
  // create(createFileDto: CreateFileDto) {
  //   return 'This action adds a new file';
  // }
  createFile = async (fileData: any) => {
    const createdFile = await this.fileModel.create(fileData);
    return createdFile;
  };

  findAll() {
    return `This action returns all files`;
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  // update(id: number, updateFileDto: UpdateFileDto) {
  //   return `This action updates a #${id} file`;
  // }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }
}
