import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Books } from './book.schema';
import { Model } from 'mongoose';
import { Library } from './library.schema';

@Injectable()
export class BooksService {
    constructor(
        @InjectModel(Books.name) private BookModel: Model<Books>,
        @InjectModel(Library.name) private LibraryModel: Model<Library>
){}

async createlibrary(): Promise<Library>{
    const Book1 = await this.BookModel.create({
        title:"notbook",
        author:"shivam" 
    })
     const Book2 =  await this.BookModel.create({
        title:"notbook2",
        author:"shivam shukla" 
    })
   
    const library = await this.LibraryModel.create({
            libraryname:"library",
            Books: [await Book1._id, await Book2._id]
    })

    return library.save()
}

async getlibrarydata(): Promise<Library[]>{
    return this.LibraryModel.find().populate('Books')
}

}
