import { Controller, Get, Post } from '@nestjs/common';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}


  @Get()
  getlibrarydata(){
    return this.booksService.getlibrarydata()
  }

  @Post()
  createbookinlibrary(){
    return this.booksService.createlibrary()
  }
}
