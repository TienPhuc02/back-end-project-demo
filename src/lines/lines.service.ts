import { Injectable } from '@nestjs/common';
import { CreateLineDto } from './dto/create-line.dto';
import { UpdateLineDto } from './dto/update-line.dto';
import { Line, LineDocument } from './schema/line.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class LinesService {
  constructor(
    @InjectModel(Line.name)
    private lineModel: SoftDeleteModel<LineDocument>,
  ) {}
  async create(createLineDto: CreateLineDto) {
    const { name, nameTransform, total } = createLineDto;
    return await this.lineModel.create({
      name,
      nameTransform,
      total,
    });
  }

  // async processLinesAndVols(lineArray) {
  //   const processedLines = [];

  //   for (const lineData of lineArray) {
  //     const { name, vol } = lineData;
  //     const processedVols = [];

  //     if (vol && vol.length > 0) {
  //       for (const volName of vol) {
  //         const existingVol = await this.volModel.findOne({ name: volName });

  //         if (existingVol) {
  //           processedVols.push(existingVol._id);
  //         } else {
  //           // // Create a new vol and use its Object ID
  //           const newVol = await this.volModel.create({ name: volName });
  //           processedVols.push(newVol._id);
  //         }
  //       }
  //       const existingLines = await this.lineModel.find({ name });
  //       if (processedVols.length > 0) {
  //         if (existingLines.length > 0) {
  //           for (const existingLine of existingLines) {
  //             existingLine.vol = processedVols;
  //             await existingLine.save();
  //           }
  //         } else {
  //           const newLine = await this.lineModel.create({
  //             name,
  //             vol: processedVols,
  //           });
  //           processedLines.push(newLine);
  //         }
  //       }
  //     }
  //   }
  //   return processedLines;
  // }

  // async createListLine(lineList: CreateLineDto[]) {
  //   const processedLines = await this.processLinesAndVols(lineList);
  //   return processedLines;
  // }
  async findAll(current: string, pageSize: string, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize; // bỏ qua current và pageSize để lấy full item trước đã rồi lọc
    const offset: number = (+current - 1) * +pageSize; // bỏ qua bao nhiêu phần tử
    const defaultLimit: number = +pageSize ? +pageSize : 10; //lấy ra số phần tử trong 1 trang
    const totalItems = (await this.lineModel.find(filter)).length; // lấy ra tổng số lượng của tất cả các phần tử
    const totalPages = Math.ceil(totalItems / defaultLimit); //lấy ra tổng số trang
    // if ((sort as any) === '-name') {
    //   // @ts-ignore: Unreachable code error
    //   sort = '-name';
    // }
    // if ((sort as any) === '-user') {
    //   // @ts-ignore: Unreachable code error
    //   sort = '-user';
    // }
    const result = await this.lineModel
      .find(filter)
      // tìm theo điều kiện
      .skip(offset)
      // bỏ qua bao nhiêu phần tử
      .limit(defaultLimit)
      // bao nhiêu phần tử 1 trang
      .select(projection as any)
      .sort(sort as any)
      .populate(population)
      .exec();
    //chọc xuống database nên sẽ là hàm promise async await
    return {
      meta: {
        current: current, //trang hiện tại
        pageSize: pageSize, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
      // không cần phải truyền giá trị currentPage vào hàm findAll vì nó được tính toán trong hàm dựa trên offset và defaultLimit.
    };
  }

  async findOne(id: string) {
    return await this.lineModel.findOne({ _id: id });
  }

  async update(id: string, updateLineDto: UpdateLineDto) {
    const { name, nameTransform, total } = updateLineDto;
    return await this.lineModel.updateOne(
      { _id: id },
      { name, nameTransform, total },
    );
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return `not found user`;
    }
    await this.lineModel.updateOne({ _id: id });
    return this.lineModel.softDelete({ _id: id });
  }
}
