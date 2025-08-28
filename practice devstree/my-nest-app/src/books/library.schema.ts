import {Prop , Schema, SchemaFactory} from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({timestamps: true})
export class Library extends Document{
    @Prop({required: true})
    libraryname: string

    @Prop({type: [{type: Types.ObjectId, ref: "Books"}]})
    Books: Types.ObjectId[]
}

export const LibrarySchema = SchemaFactory.createForClass(Library)