import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Vol } from 'src/vols/schema/vol.schema';

export type ChapterDocument = HydratedDocument<Chapter>;

@Schema({ timestamps: true })
export class Chapter {
  @Prop()
  titleChapter: string;
  @Prop()
  nameUser: string;
  @Prop()
  nameBook: string;
  @Prop()
  descriptionChapter: string;
  @Prop()
  publicYear: number;
  @Prop()
  totalVol: number;
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Vol.name })
  vol: mongoose.Schema.Types.ObjectId[];
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

export const ChapterSchema = SchemaFactory.createForClass(Chapter);
