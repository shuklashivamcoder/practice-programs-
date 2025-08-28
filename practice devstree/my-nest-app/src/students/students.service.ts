import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Students } from './students.schema';
import { Model } from 'mongoose';
import { address } from './address.schema';

@Injectable()
export class StudentsService {
    constructor(
        @InjectModel(Students.name) private studentmodel: Model<Students>,
        @InjectModel(address.name)  private addressmodel: Model<address>
    ){}

    // async createemployee(data:{name: string, age: number, country: string, state: string, city:string}): Promise<Students>{
    //     const address = await new this.addressmodel({
    //         country: "india",
    //         state: "gujarat",
    //         city: "ahmedabad"
    //     }).save()
    //     const students = await new this.studentmodel({
    //         name: "shivam",
    //         age: 20,
    //         address: address._id
    //     }).save()
    //     return students;
    // }


 async createemployee(data:{name: string, age: number, country: string, state: string, city:string}): Promise<Students>{
        const address = await new this.addressmodel({
            country: data.country,
            state: data.state,
            city: data.city
        }).save()
        const students = await new this.studentmodel({
            name: data.name,
            age: data.age,
            address: address._id
        }).save()
        return students;
    }

    async getstudentdata(){
        return this.studentmodel.find().populate('address').exec();
    }



}
