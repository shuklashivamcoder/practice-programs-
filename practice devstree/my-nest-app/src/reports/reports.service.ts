import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

let users = [{}]

@Injectable()
export class ReportsService {
  create(createReportDto: CreateReportDto) {
    users.push(createReportDto)
    return createReportDto + "report created successfully";
  }

  findAll() {
    return users;
  }

  findOne(id: number) {
    return 'users.find((user)=> user.id === id)';
  }

  update(id: number, updateReportDto: UpdateReportDto) {
    return `This action updates a #${id} report ${CreateReportDto}`;
  }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }
}
