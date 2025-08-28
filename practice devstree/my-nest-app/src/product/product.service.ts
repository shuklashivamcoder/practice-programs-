import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
    private product = [
        {id:1, name: "mobile", price: "34434"},
        {id:2, name: "tablet", price: "3443434"},
        {id:3, name: "laptop", price: "344344343"},
    ]
    getalldata(){
        return this.product
    }
    getiddata(id: number){
        return this.product.find((product)=> product.id === id)
    }
}
