import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Book } from 'src/books/schema/book.schema';


export type AuthorDocument = HydratedDocument<Author>;

@Schema({ timestamps: true })
export class Author {
  @Prop()
  nameAuthor: string;
  @Prop()
  address: string;
  @Prop()
  email: string;
  @Prop()
  avatar: string[];
  @Prop()
  gender: string;
  @Prop()
  nation: string;
  @Prop()
  phone: number;
  @Prop()
  totalBook: number;
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Book.name })
  nameBook: mongoose.Schema.Types.ObjectId[];
  @Prop()
  createdAt: Date;
  @Prop()
  updatedAt: Date;
  @Prop()
  deletedAt: Date;
  @Prop()
  deleted: boolean;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
