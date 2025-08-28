import { Controller, Get , Post, Body, Param} from '@nestjs/common';
import { CustomerService } from "./customer.service"
import { createcustomerdto } from './dto/create-cutomer.dto';

@Controller('customer')
export class CustomerController {
 
    constructor(private readonly CustomerService: CustomerService ){}

    @Get()
    getcutomerdata(){
     return this.CustomerService.getAllCustomer();
    }

    @Post()
    createnewcustomer(@Body() createcustomerdto: createcustomerdto){
      return this.CustomerService.addcustomer(createcustomerdto);
    }

    @Post('/:id/:name')
    updateexistinguser(@Param('id') id:string,@Body() createcustomerdto: createcustomerdto){
      return this.CustomerService.updatecustomer(Number(id),createcustomerdto)
    }


}