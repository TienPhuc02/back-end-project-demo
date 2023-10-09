import { Injectable } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { Author, AuthorDocument } from './schema/author.schema';
import { Book, BookDocument } from 'src/books/schema/book.schema';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectModel(Author.name)
    private authorModel: SoftDeleteModel<AuthorDocument>,
    @InjectModel(Book.name)
    private bookModel: SoftDeleteModel<BookDocument>,
  ) {}
  async processBooks(bookArray: string[]) {
    const processedBooks = [];

    for (const chapter of bookArray) {
      // Check if the chapter already exists in the database
      const existingChapter = await this.bookModel.findOne({
        name: chapter,
      });

      if (existingChapter) {
        // Use the existing chapter's Object ID
        processedBooks.push(existingChapter._id);
      } else {
        // Create a new chapter and use its Object ID
        const newChapter = await this.bookModel.create({ name: chapter });
        processedBooks.push(newChapter._id);
      }
    }

    return processedBooks;
  }

  async create(createAuthorDto: CreateAuthorDto) {
    const {
      nameAuthor,
      address,
      gender,
      nation,
      phone,
      book,
      avatar,
      totalBook,
    } = createAuthorDto;
    const processedBooks = await this.processBooks(book);
    return await this.authorModel.create({
      nameAuthor,
      phone,
      nation,
      totalBook,
      avatar,
      gender,
      address,
      book: processedBooks,
    });
  }

  async findAll(current: string, pageSize: string, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize; // bỏ qua current và pageSize để lấy full item trước đã rồi lọc
    const offset: number = (+current - 1) * +pageSize; // bỏ qua bao nhiêu phần tử
    const defaultLimit: number = +pageSize ? +pageSize : 10; //lấy ra số phần tử trong 1 trang
    const totalItems = (await this.authorModel.find(filter)).length; // lấy ra tổng số lượng của tất cả các phần tử
    const totalPages = Math.ceil(totalItems / defaultLimit); //lấy ra tổng số trang
    // if ((sort as any) === '-name') {
    //   // @ts-ignore: Unreachable code error
    //   sort = '-name';
    // }
    // if ((sort as any) === '-author') {
    //   // @ts-ignore: Unreachable code error
    //   sort = '-author';
    // }
    const result = await this.authorModel
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
    return await this.authorModel.findOne({ _id: id }).populate({
      path: 'chapter',
      populate: {
        path: 'vol',
        populate: {
          path: 'post',
        },
      },
    });
  }

  async update(id: string, updateAuthorDto: UpdateAuthorDto) {
    const {
      nameAuthor,
      address,
      gender,
      nation,
      phone,
      avatar,
      totalBook,
      book,
    } = updateAuthorDto;
    const processedBooks = await this.processBooks(book);
    return await this.authorModel.updateOne(
      { _id: id },
      {
        nameAuthor,
        address,
        gender,
        nation,
        phone,
        avatar,
        totalBook,
        book: processedBooks,
      },
    );
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return `not found user`;
    }
    await this.authorModel.updateOne({ _id: id });
    return this.authorModel.softDelete({ _id: id });
  }
}
