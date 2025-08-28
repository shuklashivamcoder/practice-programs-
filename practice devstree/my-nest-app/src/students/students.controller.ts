import { Controller, Post , Body, Get} from '@nestjs/common';
import { StudentsService } from './students.service';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  getstudentdata(){
    return this.studentsService.getstudentdata()
  }

  @Post()
  createstudents(@Body() data:{name: string, age: number, country: string, state: string, city:string}){
    return this.studentsService.createemployee(data)
  }
}
