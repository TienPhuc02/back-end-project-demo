import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { Book, BookDocument } from './schema/book.schema';
import { Chapter, ChapterDocument } from 'src/chapters/schema/chapter.schema';
import { User, UserDocument } from 'src/users/schema/user.schema';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name)
    private bookModel: SoftDeleteModel<BookDocument>,
    @InjectModel(Chapter.name)
    private chapterModel: SoftDeleteModel<ChapterDocument>,
    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>,
  ) {}
  async processChapters(chapterArray: string[]) {
    const processedChapters = [];

    for (const chapter of chapterArray) {
      // Check if the chapter already exists in the database
      const existingChapter = await this.chapterModel.findOne({
        titleChapter: chapter,
      });

      if (existingChapter) {
        // Use the existing chapter's Object ID
        processedChapters.push(existingChapter._id);
      } else {
        // Create a new chapter and use its Object ID
        const newChapter = await this.chapterModel.create({
          titleChapter: chapter,
        });
        processedChapters.push(newChapter._id);
      }
    }

    return processedChapters;
  }

  async create(createBookDto: CreateBookDto) {
    const {
      nameBook,
      chapter,
      totalChapter,
      descriptionBook,
      publicYear,
      publisher,
      language,
      genre,
      thumbnailBook,
      sliderBook,
    } = createBookDto;

    const processedChapters = [];

    for (const chapterTitle of chapter) {
      // Create a new chapter for each chapter title
      const newChapter = await this.chapterModel.create({
        titleChapter: chapterTitle,
        nameBook: nameBook,
        nameUser: createBookDto.nameUser,
      });
      processedChapters.push(newChapter._id);
    }
    const existingBook = await this.bookModel.findOne({
      nameBook,
    });
    const existingUser = await this.bookModel.findOne({
      nameUser: createBookDto.nameUser,
    });

    if (existingBook && existingUser) {
      existingBook.descriptionBook = descriptionBook;
      existingBook.publicYear = publicYear;
      existingBook.nameUser = existingUser.nameUser;
      existingBook.publisher = publisher;
      existingBook.genre = genre;
      existingBook.totalChapter = totalChapter;
      existingBook.language = language;
      existingBook.thumbnailBook = thumbnailBook;
      existingBook.sliderBook = sliderBook;
      existingBook.chapter = processedChapters;
      await existingBook.save();
      return existingBook;
    } else {
      const newBook = await this.bookModel.create({
        nameBook,
        nameUser: createBookDto.nameUser,
        descriptionBook,
        publicYear,
        publisher,
        genre,
        totalChapter,
        language,
        thumbnailBook,
        sliderBook,
        chapter: processedChapters,
      });
      return newBook;
    }
  }

  async findAll(current: string, pageSize: string, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize; // bỏ qua current và pageSize để lấy full item trước đã rồi lọc
    const offset: number = (+current - 1) * +pageSize; // bỏ qua bao nhiêu phần tử
    const defaultLimit: number = +pageSize ? +pageSize : 10; //lấy ra số phần tử trong 1 trang
    const totalItems = (await this.bookModel.find(filter)).length; // lấy ra tổng số lượng của tất cả các phần tử
    const totalPages = Math.ceil(totalItems / defaultLimit); //lấy ra tổng số trang
    // if ((sort as any) === '-name') {
    //   // @ts-ignore: Unreachable code error
    //   sort = '-name';
    // }
    // if ((sort as any) === '-book') {
    //   // @ts-ignore: Unreachable code error
    //   sort = '-book';
    // }
    const result = await this.bookModel
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
    return await this.bookModel.findOne({ _id: id }).populate({
      path: 'chapter',
      populate: {
        path: 'vol',
      },
    });
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    const {
      nameBook,
      chapter,
      descriptionBook,
      publicYear,
      publisher,
      language,
      genre,
      totalChapter,
      thumbnailBook,
      sliderBook,
    } = updateBookDto;
    const processedChapters = await this.processChapters(chapter);

    const existingBook = await this.bookModel.findOne({
      nameBook,
    });
    const existingUser = await this.bookModel.findOne({
      nameUser: updateBookDto.nameUser,
    });
    if (existingBook && existingUser) {
      existingBook.descriptionBook = descriptionBook;
      existingBook.publicYear = publicYear;
      existingBook.nameUser = existingUser.nameUser;
      existingBook.publisher = publisher;
      existingBook.genre = genre;
      existingBook.totalChapter = totalChapter;
      existingBook.language = language;
      existingBook.thumbnailBook = thumbnailBook;
      existingBook.sliderBook = sliderBook;
      existingBook.chapter = processedChapters;
      await existingBook.save();
      return existingBook;
    } else {
      const newBook = await this.bookModel.updateOne(
        { _id: id },
        {
          nameBook,
          nameUser: updateBookDto.nameUser,
          descriptionBook,
          publicYear,
          publisher,
          genre,
          totalChapter,
          language,
          thumbnailBook,
          sliderBook,
          chapter: processedChapters,
        },
      );
      return newBook;
    }
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return `not found user`;
    }
    await this.bookModel.updateOne({ _id: id });
    return this.bookModel.softDelete({ _id: id });
  }
}
