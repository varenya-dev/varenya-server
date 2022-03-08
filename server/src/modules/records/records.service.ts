import { FirebaseService } from './../firebase/firebase.service';
import { LoggedInUser } from './../../dto/logged-in-user.dto';
import { Doctor } from 'src/models/doctor.model';
import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/user.model';
import { Repository } from 'typeorm';
import { PatientDto } from 'src/dto/patient.dto';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,

    private readonly firebaseService: FirebaseService,
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

  public async fetchLinkedPatients(
    loggedInUser: LoggedInUser,
  ): Promise<PatientDto[]> {
    let doctorUser: Doctor;

    try {
      doctorUser = await this.doctorRepository.findOneOrFail({
        where: {
          user: loggedInUser.databaseUser,
        },
        relations: ['patients'],
      });
    } catch (error) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }

    const patientDtos = await Promise.all(
      doctorUser.patients.map(
        async (patient) => await this.getPatientDetails(patient.firebaseId),
      ),
    );

    return patientDtos;
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

  private async getPatientDetails(patientId: string): Promise<PatientDto> {
    const patientFirebase = await this.firebaseService.firebaseAuth.getUser(
      patientId,
    );

    const patientDetails = new PatientDto(
      patientFirebase.uid,
      patientFirebase.displayName,
      patientFirebase.photoURL,
    );

    return patientDetails;
  }
}
