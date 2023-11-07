import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Chapter } from 'src/chapters/schema/chapter.schema';

export type BookDocument = HydratedDocument<Book>;

@Schema({ timestamps: true })
export class Book {
  @Prop()
  nameBook: string;
  @Prop()
  nameUser: string;
  @Prop()
  descriptionBook: string;
  @Prop()
  publicYear: number;
  @Prop()
  publisher: string;
  @Prop()
  language: string[];
  @Prop()
  genre: string[];
  @Prop()
  thumbnailBook: string;
  @Prop()
  totalChapter: number;
  @Prop()
  sliderBook: string[];
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Chapter.name })
  chapter: mongoose.Schema.Types.ObjectId[];
  @Prop()
  createdAt: Date;
  @Prop()
  updatedAt: Date;
  @Prop()
  deletedAt: Date;
  @Prop({ type: Object })
  createdBy: {
    id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
  @Prop({ type: Object })
  updatedBy: {
    id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
  @Prop()
  deleted: boolean;
}

export const BookSchema = SchemaFactory.createForClass(Book);
