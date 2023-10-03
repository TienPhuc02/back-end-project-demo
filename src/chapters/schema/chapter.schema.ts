import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Vol } from 'src/vols/schema/vol.schema';

export type ChapterDocument = HydratedDocument<Chapter>;

@Schema({ timestamps: true })
export class Chapter {
  @Prop()
  name: string;

  @Prop()
  author: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Vol.name })
  vol: mongoose.Schema.Types.ObjectId[];
  @Prop()
  createdAt: Date;
  @Prop()
  updatedAt: Date;
  @Prop()
  deletedAt: Date;
  @Prop()
  deleted: boolean;
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);
