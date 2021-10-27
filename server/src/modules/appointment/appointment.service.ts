import { DoctorAppointmentResponse } from './../../dto/appointment/doctor-appointment-response.dto';
import { PatientAppointmentResponse } from './../../dto/appointment/patient-appointment-response.dto';
import { FirebaseService } from './../firebase/firebase.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from 'src/models/appointment.model';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { auth } from 'firebase-admin';
import { Roles } from 'src/enum/roles.enum';
import { DoctorDto } from 'src/dto/doctor.dto';
import { PatientDto } from 'src/dto/patient.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,

    private readonly userService: UserService,

    private readonly firebaseService: FirebaseService,
  ) {}

  public async getPatientAppointments(
    loggedInUser: auth.UserRecord,
  ): Promise<PatientAppointmentResponse[]> {
    const patientUser = await this.userService.findOneUserByFirebaseId(
      loggedInUser.uid,
    );

    if (patientUser.role !== Roles.Main) {
      throw new ForbiddenException({
        message: 'Forbidden to access this endpoint',
      });
    }

    const patientAppointments = await this.appointmentRepository.find({
      where: {
        patientUser: patientUser,
      },
      relations: ['doctorUser'],
    });

    const mappedAppointments = await Promise.all(
      patientAppointments.map(async (appointment) => {
        const doctorDetails = await this.getDoctorDetails(
          appointment.doctorUser.firebaseId,
        );

        return new PatientAppointmentResponse(appointment, doctorDetails);
      }),
    );

    return mappedAppointments;
  }

  public async getDoctorAppointments(
    loggedInUser: auth.UserRecord,
  ): Promise<DoctorAppointmentResponse[]> {
    const doctorUser = await this.userService.findOneUserByFirebaseId(
      loggedInUser.uid,
    );

    if (doctorUser.role !== Roles.Professional) {
      throw new ForbiddenException({
        message: 'Forbidden to access this endpoint',
      });
    }

    const doctorAppointments = await this.appointmentRepository.find({
      where: {
        doctorUser: doctorUser,
      },
      relations: ['patientUser'],
    });

    const mappedAppointments = await Promise.all(
      doctorAppointments.map(async (appointment) => {
        const patientDetails = await this.getPatientDetails(
          appointment.patientUser.firebaseId,
        );

        return new DoctorAppointmentResponse(appointment, patientDetails);
      }),
    );

    return mappedAppointments;
  }

  private async getDoctorDetails(doctorId: string): Promise<DoctorDto> {
    const doctorData = await this.firebaseService.firebaseFirestore
      .collection('doctors')
      .doc(doctorId)
      .get();

    const doctorJson = doctorData.data();

    const doctorObject = new DoctorDto(
      doctorJson['id'],
      doctorJson['clinicAddress'],
      doctorJson['cost'],
      doctorJson['fullName'],
      doctorJson['imageUrl'],
      doctorJson['jobTitle'],
      doctorJson['specializations'],
    );

    return doctorObject;
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