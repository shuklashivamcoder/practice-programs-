import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";



@Schema({ timestamps : true})
export class address extends Document{
    @Prop({required: true})
    country: string

    @Prop({required: true})
    state: string
 
    @Prop({required: true})
    city: string
}

export const addressSchema = SchemaFactory.createForClass(address)