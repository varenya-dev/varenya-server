import { FilterDoctorDto } from 'src/dto/doctor/filter-doctor.dto';
import { UserService } from './../user/user.service';
import { Doctor } from './../../models/doctor.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Any, Equal, In, Repository } from 'typeorm';
import { Specialization } from 'src/models/specialization.model';
import { NewOrUpdatedDoctor } from 'src/dto/doctor/new-update-doctor.dto';
import { LoggedInUser } from 'src/dto/logged-in-user.dto';
import { User } from 'src/models/user.model';
import { intersectionBy, flatten } from 'lodash';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(Specialization)
    private readonly specializationRepository: Repository<Specialization>,
    private readonly userService: UserService,
  ) {}

  public async filterDoctor(
    filterDoctorDto: FilterDoctorDto,
  ): Promise<Doctor[]> {
    if (
      filterDoctorDto.jobTitle === 'EMPTY' &&
      filterDoctorDto.specializations.length === 0
    ) {
      return await this.doctorRepository.find();
    } else if (
      filterDoctorDto.jobTitle !== 'EMPTY' &&
      filterDoctorDto.specializations.length === 0
    ) {
      return await this.getDoctorsByJobTitle(filterDoctorDto.jobTitle);
    } else if (
      filterDoctorDto.jobTitle !== 'EMPTY' &&
      filterDoctorDto.specializations.length > 0
    ) {
      const jobTitleDocs = await this.getDoctorsByJobTitle(
        filterDoctorDto.jobTitle,
      );
      const specializationDocs = await this.getDoctorsBySpecialization(
        filterDoctorDto.specializations,
      );

      return intersectionBy(jobTitleDocs, specializationDocs, 'id');
    } else if (
      filterDoctorDto.jobTitle === 'EMPTY' &&
      filterDoctorDto.specializations.length > 0
    ) {
      return await this.getDoctorsBySpecialization(
        filterDoctorDto.specializations,
      );
    } else {
      throw new HttpException('Invalid Filters', HttpStatus.BAD_REQUEST);
    }
  }

  private async getDoctorsByJobTitle(jobTitle: string): Promise<Doctor[]> {
    return await this.doctorRepository.find({
      where: {
        jobTitle: Equal(jobTitle),
      },
    });
  }

  private async getDoctorsBySpecialization(
    specializations: string[],
  ): Promise<Doctor[]> {
    const specializationsWithDoctors = await this.specializationRepository.find(
      {
        where: {
          specialization: In(specializations),
        },
        relations: ['doctors'],
      },
    );

    return flatten(specializationsWithDoctors.map((s) => s.doctors));
  }

  public async createDoctor(
    loggedInUser: LoggedInUser,
    newDoctorDto: NewOrUpdatedDoctor,
  ): Promise<Doctor> {
    const checkDoctor = await this.doctorRepository.findOne({
      user: loggedInUser.databaseUser,
    });

    if (checkDoctor != null) {
      throw new HttpException('Doctor already exists.', HttpStatus.BAD_REQUEST);
    }

    const specializations: Specialization[] = await Promise.all(
      newDoctorDto.specializations.map(async (specialization) => {
        const formattedSpecialization = specialization.toUpperCase();

        const dbSpecialization = await this.specializationRepository.findOne({
          specialization: formattedSpecialization,
        });

        if (dbSpecialization != null) {
          return dbSpecialization;
        } else {
          const newSpecialization: Specialization = new Specialization();
          newSpecialization.specialization = formattedSpecialization;

          return await this.specializationRepository.save(newSpecialization);
        }
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

    return savedDoctor;
  }

  public async updateDoctor(
    loggedInUser: LoggedInUser,
    updatedDoctorDto: NewOrUpdatedDoctor,
  ): Promise<Doctor> {
    const dbDoctor = await this.doctorRepository.findOne({
      user: loggedInUser.databaseUser,
    });

    if (dbDoctor == null) {
      throw new HttpException('Doctor does not exists.', HttpStatus.NOT_FOUND);
    }

    const specializations: Specialization[] = await Promise.all(
      updatedDoctorDto.specializations.map(async (specialization) => {
        const formattedSpecialization = specialization.toUpperCase();

        const dbSpecialization = await this.specializationRepository.findOne({
          specialization: formattedSpecialization,
        });

        if (dbSpecialization != null) {
          return dbSpecialization;
        } else {
          const newSpecialization: Specialization = new Specialization();
          newSpecialization.specialization = formattedSpecialization;

          return await this.specializationRepository.save(newSpecialization);
        }
      }),
    );

    dbDoctor.fullName = updatedDoctorDto.fullName;
    dbDoctor.imageUrl = updatedDoctorDto.imageUrl;
    dbDoctor.jobTitle = updatedDoctorDto.jobTitle;
    dbDoctor.clinicAddress = updatedDoctorDto.clinicAddress;
    dbDoctor.cost = updatedDoctorDto.cost;
    dbDoctor.specializations = specializations;

    const updatedDoctor = await this.doctorRepository.save(dbDoctor);

    return updatedDoctor;
  }

  public async deleteDoctor(user: User): Promise<void> {
    const dbDoctor = await this.doctorRepository.findOne({
      user: user,
    });

    if (dbDoctor != null) {
      await this.doctorRepository.remove(dbDoctor);
    }
  }
}
