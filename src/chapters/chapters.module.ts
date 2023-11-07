import { Module } from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { ChaptersController } from './chapters.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Chapter, ChapterSchema } from './schema/chapter.schema';
import { Vol, VolSchema } from 'src/vols/schema/vol.schema';
import { User, UserSchema } from 'src/users/schema/user.schema';
import { Book, BookSchema } from 'src/books/schema/book.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chapter.name, schema: ChapterSchema }]),
    MongooseModule.forFeature([{ name: Vol.name, schema: VolSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
  ],
  controllers: [ChaptersController],
  providers: [ChaptersService],
  exports: [ChaptersModule],
})
export class ChaptersModule {}
