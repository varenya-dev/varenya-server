import { UserService } from './../user/user.service';
import { Doctor } from './../../models/doctor.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Specialization } from 'src/models/specialization.model';
import { NewDoctorDto } from 'src/dto/doctor/new-doctor.dto';
import { LoggedInUser } from 'src/dto/logged-in-user.dto';
import { User } from 'src/models/user.model';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(Specialization)
    private readonly specializationRepository: Repository<Specialization>,
    private readonly userService: UserService,
  ) {}

  public async createDoctor(
    loggedInUser: LoggedInUser,
    newDoctorDto: NewDoctorDto,
  ): Promise<Doctor> {
    const specializations: Specialization[] = await Promise.all(
      newDoctorDto.specializations.map(async (specialization) => {
        const newSpecialization: Specialization = new Specialization();
        newSpecialization.specialization = specialization;

        return await this.specializationRepository.save(newSpecialization);
      }),
    );

    const correspondingUser: User =
      await this.userService.findOneUserByFirebaseId(
        loggedInUser.firebaseUser.uid,
      );

    const newDoctor: Doctor = new Doctor();
    newDoctor.fullName = newDoctorDto.fullName;
    newDoctor.imageUrl = newDoctorDto.imageUrl;
    newDoctor.jobTitle = newDoctorDto.jobTitle;
    newDoctor.clinicAddress = newDoctorDto.clinicAddress;
    newDoctor.cost = newDoctorDto.cost;
    newDoctor.specializations = specializations;
    newDoctor.user = correspondingUser;

    const savedDoctor = await this.doctorRepository.save(newDoctor);

    correspondingUser.doctor = savedDoctor;

    await this.userService.saveUser(correspondingUser);

    return savedDoctor;
  }
}
