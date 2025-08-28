import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { StudentModule } from 'src/student/student.module';

@Module({
  imports : [ StudentModule ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
