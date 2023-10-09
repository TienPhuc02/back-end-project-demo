import { Module } from '@nestjs/common';
import { LinesService } from './lines.service';
import { LinesController } from './lines.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Line, LineSchema } from './schema/line.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Line.name, schema: LineSchema }]),
  ],
  controllers: [LinesController],
  providers: [LinesService],
})
export class LinesModule {}
