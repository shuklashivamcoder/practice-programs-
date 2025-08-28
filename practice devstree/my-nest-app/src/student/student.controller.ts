import { Body, Controller, Delete, Get , Param, ParseIntPipe, Patch, Post, Put, UseFilters, UseGuards} from '@nestjs/common';
import { StudentService} from './student.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { HttpExceptionFilter } from 'src/filters/http-exception/http-exception.filter';

@Controller('student')
@UseFilters(HttpExceptionFilter)
export class StudentController {
    constructor( readonly studentservice: StudentService){}

    @Get()
     @UseGuards(AuthGuard)
    getstudentdata(){
        return this.studentservice.getstudentdata()
    }

    @Get(":id")
    getstudentbyid(@Param('id', ParseIntPipe) id: string){
    return this.studentservice.getstudentdatabasedonid(Number(id))
    }

    @Post()
    createnewstudent(@Body() body: { name: string, course: string}){
        return this.studentservice.createstudent(body)
    }

    @Put(':id')
    updateexistingstudent(@Param('id') id: string, @Body() body: {name: string, course: string}){
        return this.studentservice.updatestudent(Number(id), body)
    }

    @Patch(':id')
    partiallyupdate(@Param('id') id: string, @Body() body: { name: string; course: string}){
        return this.studentservice.patchstudent(Number(id), body) 
    }

    @Delete(':id')
    deletestudent(@Param('id') id: string, @Body() body:{name: string; course: string} ){
        return this.studentservice.deletestudent(Number(id), body)

    }
    



    
}
