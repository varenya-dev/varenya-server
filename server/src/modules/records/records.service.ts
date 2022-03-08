import { LoggedInUser } from './../../dto/logged-in-user.dto';
import { Doctor } from 'src/models/doctor.model';
import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
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

  public async fetchLinkedDoctors(
    loggedInUser: LoggedInUser,
  ): Promise<Doctor[]> {
    let user: User;

    try {
      user = await this.userRepository.findOneOrFail({
        where: {
          id: loggedInUser.databaseUser.id,
        },
        relations: ['doctors', 'doctors.user'],
      });
    } catch (error) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }

    return user.doctors;
  }

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
