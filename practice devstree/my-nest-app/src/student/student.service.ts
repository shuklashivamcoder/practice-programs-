import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';

@Injectable()
export class StudentService {
    student = [
        {id: 1, name: "shivam", course: "cse"},
        {id: 2, name: "shivam shukla", course: "csee"},
        {id: 3, name: "shivam shukla ", course: "cse-it"}
    ]

    getstudentdata(){
       
        return this.student
    }

    getstudentdatabasedonid(id:number){
     const students = this.student.filter((s)=> s.id === id)
     return students
    }

    //using post method
    createstudent( data: { name: string;  course: string} ){
        const newstudent ={
            id: Date.now(),
            ...data
        };
        this.student.push(newstudent)
        return newstudent
    }

    // using put method
    updatestudent(id:number, data: {name: string, course: string}){

        const index = this.student.findIndex((s)=> s.id === id)
        // if(index) throw new NotFoundException('student not found')
            this.student[index] = {id, ...data}
        return this.student[index]
    }

    //using patch method
    patchstudent(id:number, data: Partial<{name: string; course: string}>){
        const student = this.getstudentdatabasedonid(id)
       Object.assign(student, data )
       return student
     
    
    } 

    //using delete method
    deletestudent(id: number, data: {name: string, course: string}){
        const index = this.student.findIndex((s)=> s.id === id)

        const deletedstudent = this.student.splice(index, 1)
        return deletedstudent;
    }


}
