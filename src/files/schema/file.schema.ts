import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type FileDocument = HydratedDocument<File>;

@Schema({ timestamps: true })
export class File {
  @Prop()
  filename: string;
  @Prop()
  originalname: string;
  @Prop()
  mimetype: string;
  @Prop()
  size: string;
  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    emailAddress: string;
  };
  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    emailAddress: string;
  };
  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    emailAddress: string;
  };
  @Prop()
  deletedAt: Date;
  @Prop()
  createdAt: Date;
  @Prop()
  updatedAt: Date;
  @Prop({ default: false })
  isDeleted: boolean;
}

export const FileSchema = SchemaFactory.createForClass(File);
