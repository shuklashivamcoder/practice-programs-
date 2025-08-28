import { Controller, Get, UseGuards } from '@nestjs/common';
import { roles } from 'src/guards/roles/roles.decorator';
import { Roles } from 'src/guards/roles/roles.enum';
import { RolesGuard } from 'src/guards/roles/roles.guard';

@Controller('user-roles')
export class UserRolesController {
    @Get('admin-data')
    @UseGuards(RolesGuard)
    @roles(Roles.Admin)
    getAdmindata(){
        return {message: "only admin can access"}
    }

    @Get('user-data')
    getuserdata(){
        return {message: "only user can access"}
    }
}
