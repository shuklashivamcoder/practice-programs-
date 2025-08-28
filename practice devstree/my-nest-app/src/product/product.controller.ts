import { Controller, Get, Param } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
    constructor(private readonly ProductService:ProductService){}

    @Get()
    getproducts(){
        return this.ProductService.getalldata()
    }
    @Get(":id")
    getproductbasedonid(@Param('id') id: string){
        return this.ProductService.getiddata(Number(id))
    }
}
