import { Module } from '@nestjs/common';
import { VolsService } from './vols.service';
import { VolsController } from './vols.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Vol, VolSchema } from './schema/vol.schema';
import { Post, PostSchema } from 'src/posts/schema/post.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Vol.name, schema: VolSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  controllers: [VolsController],
  providers: [VolsService],
})
export class VolsModule {}
