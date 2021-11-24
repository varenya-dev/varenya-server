import { DoctorModule } from './../doctor/doctor.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from 'src/models/user.model';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User]), DoctorModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
