import { Doctor } from 'src/models/doctor.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/user.model';
import { Repository } from 'typeorm';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  public async linkDoctorAndUser(
    doctorId: string,
    userId: string,
  ): Promise<void> {
    const userModel = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    const doctorModel = await this.doctorRepository.findOne({
      where: {
        id: doctorId,
      },
      relations: ['patients'],
    });

    doctorModel.patients.push(userModel);

    await this.doctorRepository.save(doctorModel);
  }
}
