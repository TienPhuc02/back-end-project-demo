import { Injectable } from '@nestjs/common';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { Chapter, ChapterDocument } from './schema/chapter.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { Vol, VolDocument } from 'src/vols/schema/vol.schema';
import { Author, AuthorDocument } from 'src/authors/schema/author.schema';
import { Book, BookDocument } from 'src/books/schema/book.schema';

@Injectable()
export class ChaptersService {
  constructor(
    @InjectModel(Chapter.name)
    private chapterModel: SoftDeleteModel<ChapterDocument>,
    @InjectModel(Vol.name)
    private volModel: SoftDeleteModel<VolDocument>,
    @InjectModel(Author.name)
    private authorModel: SoftDeleteModel<AuthorDocument>,
    @InjectModel(Book.name)
    private bookModel: SoftDeleteModel<BookDocument>,
  ) {}
  async processVols(volArray: string[]) {
    const processedVols = [];

    for (const vol of volArray) {
      // Check if the chapter already exists in the database
      const existingVol = await this.volModel.findOne({
        name: vol,
      });

      if (existingVol) {
        // Use the existing chapter's Object ID
        processedVols.push(existingVol._id);
      } else {
        // Create a new chapter and use its Object ID
        const newVol = await this.volModel.create({ name: vol });
        processedVols.push(newVol._id);
      }
    }

    return processedVols;
  }

  async create(createChapterDto: CreateChapterDto) {
    const { titleChapter, descriptionChapter, publicYear, totalVol, vol } =
      createChapterDto;
    //
    const processedVols = [];

    for (const volTitle of vol) {
      // Create a new chapter for each chapter title
      const newVol = await this.volModel.create({
        name: volTitle,
        titleChapter: titleChapter,
        nameAuthor: createChapterDto.nameAuthor,
        nameBook: createChapterDto.nameBook,
      });
      processedVols.push(newVol._id);
    }
    const existingChapter = await this.chapterModel.findOne({
      titleChapter,
    });
    const existingAuthor = await this.chapterModel.findOne({
      nameAuthor: createChapterDto.nameAuthor,
    });
    const existingBook = await this.chapterModel.findOne({
      nameBook: createChapterDto.nameBook,
    });

    if (existingChapter && existingAuthor && existingBook) {
      existingChapter.descriptionChapter = descriptionChapter;
      existingChapter.publicYear = publicYear;
      existingChapter.totalVol = totalVol;
      existingChapter.vol = processedVols;
      existingChapter.nameAuthor = createChapterDto.nameAuthor;
      existingChapter.nameBook = existingBook.nameBook;
      await existingChapter.save();
      return existingChapter;
    } else {
      const newChapter = await this.chapterModel.create({
        titleChapter,
        nameAuthor: createChapterDto.nameAuthor,
        nameBook: createChapterDto.nameBook,
        descriptionChapter,
        publicYear,
        totalVol,
        vol: processedVols,
      });
      return newChapter;
    }
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
    const { titleChapter, descriptionChapter, publicYear, totalVol, vol } =
      updateChapterDto;
    const processedVols = await this.processVols(vol);
    const existingChapter = await this.chapterModel.findOne({
      titleChapter,
    });
    const existingAuthor = await this.authorModel.findOne({
      nameAuthor: updateChapterDto.nameAuthor,
    });

    if (existingAuthor) {
      // Tên tác giả đã tồn tại, gán nameAuthor từ kết quả truy vấn
      updateChapterDto.nameAuthor = existingAuthor.nameAuthor;
    }
    const existingBook = await this.bookModel.findOne({
      nameBook: updateChapterDto.nameBook,
    });

    if (existingBook) {
      updateChapterDto.nameBook = existingBook.nameBook;
    }
    if (existingChapter && existingAuthor) {
      existingChapter.descriptionChapter = descriptionChapter;
      existingChapter.publicYear = publicYear;
      existingChapter.totalVol = totalVol;
      existingChapter.vol = processedVols;
      existingChapter.nameAuthor = updateChapterDto.nameAuthor;
      existingChapter.nameBook = updateChapterDto.nameBook;
      await existingChapter.save();
      return existingChapter;
    } else {
      const newChapter = await this.chapterModel.updateOne(
        { _id: id },
        {
          titleChapter,
          nameAuthor: updateChapterDto.nameAuthor,
          nameBook: updateChapterDto.nameBook,
          descriptionChapter,
          publicYear,
          totalVol,
          vol: processedVols,
        },
      );
      return newChapter;
    }
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return `not found user`;
    }
    await this.chapterModel.updateOne({ _id: id });
    return this.chapterModel.softDelete({ _id: id });
  }
}
