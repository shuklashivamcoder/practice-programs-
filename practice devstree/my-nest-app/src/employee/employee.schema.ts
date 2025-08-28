import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


export type EmployeeDocument = Employee & Document

@Schema({ timestamps : true})

export class Employee{
    @Prop({required: true})
    name: string;

    @Prop({ required: true})
    age: number;

    @Prop()
    email?: string;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee)