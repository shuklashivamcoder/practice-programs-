import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Students, StudentsSchema } from './students.schema';
import { address, addressSchema } from './address.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Students.name, schema: StudentsSchema},
      {name : address.name, schema: addressSchema}
    ])
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}
