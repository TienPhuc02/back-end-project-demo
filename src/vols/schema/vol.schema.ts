import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Post } from 'src/posts/schema/post.schema';

export type VolDocument = HydratedDocument<Vol>;

@Schema({ timestamps: true })
export class Vol {
  @Prop()
  name: string;
  @Prop({ type: [mongoose.Schema.Types.ObjectId],ref:Post.name })
  post: mongoose.Schema.Types.ObjectId[];
  @Prop()
  createdAt: Date;
  @Prop()
  updatedAt: Date;
  @Prop()
  deletedAt: Date;
  @Prop()
  deleted: boolean;
}

export const VolSchema = SchemaFactory.createForClass(Vol);
