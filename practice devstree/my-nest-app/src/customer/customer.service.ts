import { Injectable, NotFoundException } from '@nestjs/common';
import { customer } from './interfaces/customer.interface'
import { createcustomerdto } from './dto/create-cutomer.dto';

@Injectable()
export class CustomerService {
    private customers : customer[] = [];

    getAllCustomer():customer[] {
       return this.customers
    }

    addcustomer(createcustomerdto: createcustomerdto): customer {
       const newcustomer : customer = {
            id: Date.now(),
            ...createcustomerdto
       }
       this.customers.push(newcustomer) 
        return newcustomer
    }

    updatecustomer(id:number, createcustomerdto: createcustomerdto): customer {
    const updatecustomer = this.customers.find((s) => s.id === id)
    if(!updatecustomer) throw new NotFoundException('customer not found')
        return updatecustomer
    }
 


}
