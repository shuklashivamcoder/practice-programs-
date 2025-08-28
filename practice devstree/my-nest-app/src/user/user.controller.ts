import { Body, Controller, Get , HttpCode, HttpStatus, Param, Post, Request, Res} from '@nestjs/common';


 interface user {
    name: string;
    age: number;
    id: number;
}



let users = [{}]

@Controller('user')
export class UserController {
    @Post()
    @HttpCode(HttpStatus.ACCEPTED)
     async getuser(@Body() body: user){
      if(!body){ return 'data not found'} 
      else{ 
        users.push(body)
        return "user added successfully"
      } 

        
    }
    @Get()
    getuserdata(){
        return users
    }


    // @Get(':id')
    // getuserdatabyid(@Param('id') id: number){
    //     return users.find((user) => user.id  +id);
    // }

    @Post(':id')
    updateuser(@Param('id') id: string , @Body() body: user){

    }
}
