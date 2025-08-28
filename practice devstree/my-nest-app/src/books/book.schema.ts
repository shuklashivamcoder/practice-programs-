import {Prop , Schema, SchemaFactory} from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({timestamps: true})
export class Books extends Document{
    @Prop({required: true})
    title: string

    @Prop({ required: true})
    author: string
}

export const BooksSchema = SchemaFactory.createForClass(Books)