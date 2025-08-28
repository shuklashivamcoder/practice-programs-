import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Library, LibrarySchema } from './library.schema';
import { Books, BooksSchema } from './book.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Library.name, schema: LibrarySchema},
      {name: Books.name, schema: BooksSchema},
    ])
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
