import { Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { address } from './address.schema'


export type StudentsDocument = Students & Document;

@Schema({timestamps: true})
export class Students{
  @Prop({required: true})
  name: string;

  @Prop({ required: true})
  age: string;

  @Prop({ type : MongooseSchema.Types.ObjectId, ref: 'address' })
  address: address;
}

export const StudentsSchema = SchemaFactory.createForClass(Students)
