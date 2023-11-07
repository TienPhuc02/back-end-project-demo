import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChaptersModule } from './chapters/chapters.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { VolsModule } from './vols/vols.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { LinesModule } from './lines/lines.module';
import { FilesModule } from './files/files.module';
import { BooksModule } from './books/books.module';

@Module({
  imports: [
    ChaptersModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
        connectionFactory: (connection) => {
          connection.plugin(softDeletePlugin);
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    VolsModule,
    UsersModule,
    PostsModule,
    LinesModule,
    FilesModule,
    BooksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
