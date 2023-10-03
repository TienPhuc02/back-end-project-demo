import { Module } from '@nestjs/common';
import { VolsService } from './vols.service';
import { VolsController } from './vols.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Vol, VolSchema } from './schema/vol.schema';

@Module({
  imports:[MongooseModule.forFeature([{ name: Vol.name, schema: VolSchema }])],
  controllers: [VolsController],
  providers: [VolsService],
})
export class VolsModule {}
