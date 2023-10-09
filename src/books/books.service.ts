import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { Book, BookDocument } from './schema/book.schema';
import { Chapter, ChapterDocument } from 'src/chapters/schema/chapter.schema';
import { Author, AuthorDocument } from 'src/authors/schema/author.schema';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name)
    private bookModel: SoftDeleteModel<BookDocument>,
    @InjectModel(Chapter.name)
    private chapterModel: SoftDeleteModel<ChapterDocument>,
    @InjectModel(Author.name)
    private authorModel: SoftDeleteModel<AuthorDocument>,
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

    const processedChapters = await this.processChapters(chapter);

    const existingAuthor = await this.authorModel.findOne({
      authorName: createBookDto.nameAuthor,
    });

    if (existingAuthor) {
      // Tên tác giả đã tồn tại, gán authorName từ kết quả truy vấn
      createBookDto.nameAuthor = existingAuthor.nameAuthor;
    }
    // Kiểm tra xem cuốn sách đã tồn tại dựa trên nameBook và nameAuthor
    const existingBook = await this.bookModel.findOne({
      nameBook,
    });

    if (existingBook) {
      // Cuốn sách đã tồn tại, cập nhật thông tin của nó
      existingBook.descriptionBook = descriptionBook;
      existingBook.publicYear = publicYear;
      existingBook.nameAuthor = createBookDto.nameAuthor;
      existingBook.publisher = publisher;
      existingBook.genre = genre;
      existingBook.totalChapter = totalChapter;
      existingBook.language = language;
      existingBook.thumbnailBook = thumbnailBook;
      existingBook.sliderBook = sliderBook;
      existingBook.chapter = processedChapters;

      // Lưu lại cuốn sách đã cập nhật
      await existingBook.save();

      // Trả về cuốn sách đã cập nhật
      return existingBook;
    } else {
      // Cuốn sách chưa tồn tại, tạo mới nó
      const newBook = await this.bookModel.create({
        nameBook,
        nameAuthor: createBookDto.nameAuthor,
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

      // Trả về cuốn sách mới tạo
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
      nameAuthor,
      descriptionBook,
      publicYear,
      publisher,
      language,
      genre,
      totalChapter,
      thumbnailBook,
      sliderBook,
    } = updateBookDto;
    return await this.bookModel.updateOne(
      { _id: id },
      {
        nameBook,
        nameAuthor,
        descriptionBook,
        totalChapter,
        publicYear,
        publisher,
        genre,
        language,
        thumbnailBook,
        sliderBook,
      },
    );
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return `not found user`;
    }
    await this.bookModel.updateOne({ _id: id });
    return this.bookModel.softDelete({ _id: id });
  }
}
