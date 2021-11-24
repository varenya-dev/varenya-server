import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { Doctor } from 'src/models/doctor.model';
import { Specialization } from 'src/models/specialization.model';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor, Specialization])],
  providers: [DoctorService],
})
export class DoctorModule {}
