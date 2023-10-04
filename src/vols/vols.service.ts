import { Injectable } from '@nestjs/common';
import { CreateVolDto } from './dto/create-vol.dto';
import { UpdateVolDto } from './dto/update-vol.dto';
import { Vol, VolDocument } from './schema/vol.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class VolsService {
  constructor(
    @InjectModel(Vol.name)
    private volModel: SoftDeleteModel<VolDocument>,
  ) {}
  async create(createVolDto: CreateVolDto) {
    const { name } = createVolDto;
    return await this.volModel.create({
      name,
    });
  }

  async findAll(current: string, pageSize: string, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize; // bỏ qua current và pageSize để lấy full item trước đã rồi lọc
    const offset: number = (+current - 1) * +pageSize; // bỏ qua bao nhiêu phần tử
    const defaultLimit: number = +pageSize ? +pageSize : 10; //lấy ra số phần tử trong 1 trang
    const totalItems = (await this.volModel.find(filter)).length; // lấy ra tổng số lượng của tất cả các phần tử
    const totalPages = Math.ceil(totalItems / defaultLimit); //lấy ra tổng số trang
    // if ((sort as any) === '-name') {
    //   // @ts-ignore: Unreachable code error
    //   sort = '-name';
    // }
    // if ((sort as any) === '-author') {
    //   // @ts-ignore: Unreachable code error
    //   sort = '-author';
    // }
    const result = await this.volModel
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
    return await this.volModel.findOne({ _id: id });
  }

  async update(id: string, updateVolDto: UpdateVolDto) {
    const { name } = updateVolDto;
    return await this.volModel.updateOne({ _id: id }, { name });
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return `not found user`;
    }
    await this.volModel.updateOne({ _id: id });
    return this.volModel.softDelete({ _id: id });
  }
}
