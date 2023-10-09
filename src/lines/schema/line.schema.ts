import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LineDocument = HydratedDocument<Line>;

@Schema({ timestamps: true })
export class Line {
  @Prop()
  name: string;
  @Prop()
  nameTransform: string;
  @Prop()
  thumbnail: string;
  @Prop()
  slider: string[];
  @Prop()
  total: number;
  @Prop()
  createdAt: Date;
  @Prop()
  updatedAt: Date;
  @Prop()
  deletedAt: Date;
  @Prop()
  deleted: boolean;
}

export const LineSchema = SchemaFactory.createForClass(Line);
