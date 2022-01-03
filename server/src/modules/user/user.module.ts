import { RandomName } from './../../models/random-name.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from 'src/models/user.model';
import { Doctor } from 'src/models/doctor.model';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Doctor, RandomName])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
