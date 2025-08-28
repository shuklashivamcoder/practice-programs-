import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { ProductService } from './product/product.service';
import { ProductController } from './product/product.controller';
import { EmployeeModule } from './employee/employee.module';
import { StudentModule } from './student/student.module';
import { ReportsModule } from './reports/reports.module';
import { CustomerModule } from './customer/customer.module';
import { UserRolesController } from './user-roles/user-roles.controller';
import { LoggerMiddleware } from './middleware/logger/logger.middleware';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentsModule } from './students/students.module';
import { BooksModule } from './books/books.module';




@Module({
  imports: [EmployeeModule, StudentModule, ReportsModule, CustomerModule, ConfigModule.forRoot(), MongooseModule.forRoot(process.env.MONGODB_URI!), StudentsModule, BooksModule],
  controllers: [AppController, UserController, ProductController, UserRolesController],
  providers: [AppService, ProductService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
