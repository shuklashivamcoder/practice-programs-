import { Body, Controller, Get, Post, Param , Put, Patch, Delete} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { Employee } from './employee.schema';

@Controller('employee')
export class EmployeeController {
    constructor(private readonly EmployeeService: EmployeeService){}
    @Get()
    getemployee(){
        return this.EmployeeService.getallemployee();
    }

    @Get(':id')
    getemployeebyid(@Param('id')id:string){
        return this.EmployeeService.getemplbyeeid(id)
    }

    @Post('addemployee')
    adddata(@Body() data: Partial<Employee>){
        return this.EmployeeService.createEmployee(data);

    }

    @Put(':id')
    updateemployeedata(@Param('id') id:string, @Body() data: Partial<Employee>){
    return this.EmployeeService.updateemployee(id, data)
    }

    @Patch(':id')
    updateemployeedatausingpatch(@Param('id') id:string, data: Partial<Employee>){
        return this.EmployeeService.patchemployee(id, data)
    }

    @Delete(':id')
    Deleteemployeebyid(@Param('id') id:string){
        return this.EmployeeService.deleteemployeebyid(id)
    }

    
}
