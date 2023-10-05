import { Injectable } from '@nestjs/common';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { Chapter, ChapterDocument } from './schema/chapter.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { Vol, VolDocument } from 'src/vols/schema/vol.schema';

@Injectable()
export class ChaptersService {
  constructor(
    @InjectModel(Chapter.name)
    private chapterModel: SoftDeleteModel<ChapterDocument>,
    @InjectModel(Vol.name)
    private volModel: SoftDeleteModel<VolDocument>,
  ) {}
  async create(createChapterDto: CreateChapterDto) {
    const { name, vol } = createChapterDto;
    return await this.chapterModel.create({
      name,
      vol,
    });
  }

  async processChaptersAndVols(chapterArray) {
    const processedChapters = [];

    for (const chapterData of chapterArray) {
      const { name, vol } = chapterData;
      const processedVols = [];

      if (vol && vol.length > 0) {
        for (const volName of vol) {
          const existingVol = await this.volModel.findOne({ name: volName });

          if (existingVol) {
            processedVols.push(existingVol._id);
          } else {
            // // Create a new vol and use its Object ID
            const newVol = await this.volModel.create({ name: volName });
            processedVols.push(newVol._id);
          }
        }

    
        const existingChapters = await this.chapterModel.find({ name });
        if (processedVols.length > 0) {
          if (existingChapters.length > 0) {
            for (const existingChapter of existingChapters) {
              existingChapter.vol = processedVols; 
              await existingChapter.save();
            }
          } else {
            const newChapter = await this.chapterModel.create({
              name,
              vol: processedVols,
            });
            processedChapters.push(newChapter);
          }
        }
      }
    }

    return processedChapters;
  }

  // async updateChaptersWithVols(chapterArray) {
  //   for (const chapterData of chapterArray) {
  //     const { name, vol } = chapterData;

  //     // Tìm các chương có cùng tên trong model Chapter
  //     const existingChapters = await this.chapterModel.find({ name });

  //     if (existingChapters.length > 0) {
  //       // Nếu đã có chương với tên này, cập nhật mảng vol của chương đó
  //       for (const existingChapter of existingChapters) {
  //         existingChapter.vol = vol; // Ghi đè mảng vol bằng vol mới
  //         await existingChapter.save();
  //       }
  //     }
  //   }
  // }

  async createListChapter(chapterList: CreateChapterDto[]) {
    const processedChapters = await this.processChaptersAndVols(chapterList);
    // await this.updateChaptersWithVols(processedChapters);
    return processedChapters;
  }
  async findAll(current: string, pageSize: string, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize; // bỏ qua current và pageSize để lấy full item trước đã rồi lọc
    const offset: number = (+current - 1) * +pageSize; // bỏ qua bao nhiêu phần tử
    const defaultLimit: number = +pageSize ? +pageSize : 10; //lấy ra số phần tử trong 1 trang
    const totalItems = (await this.chapterModel.find(filter)).length; // lấy ra tổng số lượng của tất cả các phần tử
    const totalPages = Math.ceil(totalItems / defaultLimit); //lấy ra tổng số trang
    // if ((sort as any) === '-name') {
    //   // @ts-ignore: Unreachable code error
    //   sort = '-name';
    // }
    // if ((sort as any) === '-author') {
    //   // @ts-ignore: Unreachable code error
    //   sort = '-author';
    // }
    const result = await this.chapterModel
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
    return await this.chapterModel.findOne({ _id: id }).populate({
      path: 'vol',
    });
  }

  async update(id: string, updateChapterDto: UpdateChapterDto) {
    const { name, vol } = updateChapterDto;
    return await this.chapterModel.updateOne({ _id: id }, { name, vol });
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return `not found user`;
    }
    await this.chapterModel.updateOne({ _id: id });
    return this.chapterModel.softDelete({ _id: id });
  }
}
