import { FirebaseModule } from './../firebase/firebase.module';
import { Doctor } from 'src/models/doctor.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { RecordsController } from './records.controller';
import { RecordsService } from './records.service';
import { User } from 'src/models/user.model';

@Module({
  imports: [TypeOrmModule.forFeature([User, Doctor]), FirebaseModule],
  controllers: [RecordsController],
  providers: [RecordsService],
  exports: [RecordsService],
})
export class RecordsModule {}
