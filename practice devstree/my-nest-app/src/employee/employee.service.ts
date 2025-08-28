import { Injectable } from '@nestjs/common';
import { Employee, EmployeeDocument  } from './employee.schema'
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { promises } from 'dns';

@Injectable()
export class EmployeeService {
    constructor(
        @InjectModel(Employee.name) private Employeemodel: Model<EmployeeDocument>
    ){}

    async createEmployee(data: Partial<Employee>): Promise<Employee>{
        const newemployee = new this.Employeemodel(data);
        return newemployee.save();
    }

    async getallemployee():Promise<Employee[]>{
        return this.Employeemodel.find().exec();
    }

    async getemplbyeeid(id:string): Promise<Employee | null>{
        return this.Employeemodel.findById(id).exec();
    }

    async updateemployee(id: string, data: Partial<Employee>): Promise<Employee | null>{
       return this.Employeemodel.findByIdAndUpdate(id, data, {new: true}).exec();
    }

    async patchemployee(id: string, data: Partial<Employee>): Promise<Employee | null>{
        return this.Employeemodel.findByIdAndUpdate(id, data, {new: true}).exec();
    }

    async deleteemployeebyid(id: string): Promise<Employee | null>{
        return this.Employeemodel.findByIdAndDelete(id).exec();
    }
}
