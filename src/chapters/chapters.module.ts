import { Module } from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { ChaptersController } from './chapters.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Chapter, ChapterSchema } from './schema/chapter.schema';

@Module({
  imports:[MongooseModule.forFeature([{ name: Chapter.name, schema: ChapterSchema }])],
  controllers: [ChaptersController],
  providers: [ChaptersService],
  exports:[ChaptersModule]
})
export class ChaptersModule {}
