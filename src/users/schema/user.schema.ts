import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Book } from 'src/books/schema/book.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  nameUser: string;
  @Prop()
  address: string;
  @Prop()
  email: string;
  @Prop()
  password: string;
  @Prop()
  avatar: string[];
  @Prop()
  gender: string;
  @Prop()
  nation: string;
  @Prop()
  role: string;
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
  @Prop()
  refreshToken: string;
  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
