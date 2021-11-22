import { User } from 'src/models/user.model';
import { LoggedInUser } from './../../dto/logged-in-user.dto';
import { NotificationService } from './../notifications/notification.service';
import { CreateAppointmentDto } from './../../dto/appointment/create-appointment.dto';
import { DoctorAppointmentResponse } from './../../dto/appointment/doctor-appointment-response.dto';
import { PatientAppointmentResponse } from './../../dto/appointment/patient-appointment-response.dto';
import { FirebaseService } from './../firebase/firebase.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from 'src/models/appointment.model';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { DoctorDto } from 'src/dto/doctor.dto';
import { PatientDto } from 'src/dto/patient.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,

    private readonly userService: UserService,
    private readonly firebaseService: FirebaseService,
    private readonly notificationService: NotificationService,
  ) {}

  public async getPatientAppointments(
    loggedInUser: LoggedInUser,
  ): Promise<PatientAppointmentResponse[]> {
    const patientUser = loggedInUser.databaseUser;

    const patientAppointments = await this.appointmentRepository.find({
      where: {
        patientUser: patientUser,
      },
      relations: ['doctorUser', 'patientUser'],
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
    loggedInUser: LoggedInUser,
  ): Promise<DoctorAppointmentResponse[]> {
    const doctorUser = loggedInUser.databaseUser;

    const doctorAppointments = await this.appointmentRepository.find({
      where: {
        doctorUser: doctorUser,
      },
      relations: ['doctorUser', 'patientUser'],
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

  public async createNewAppointment(
    loggedInUser: LoggedInUser,
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    const patientUser = loggedInUser.databaseUser;
    let doctorUser: User;
    try {
      doctorUser = await this.userService.findOneUserByFirebaseId(
        createAppointmentDto.doctorId,
      );
    } catch (error) {
      throw new HttpException('Doctor does not exist', HttpStatus.NOT_FOUND);
    }

    const appointmentDetails = new Appointment(patientUser, doctorUser);

    await this.notificationService.handleAppointmentCreationNotification(
      createAppointmentDto.doctorId,
    );

    return await this.appointmentRepository.save(appointmentDetails);
  }

  public async updateAppointment(
    updatedAppointment: Appointment,
  ): Promise<Appointment> {
    let appointment: Appointment;

    try {
      appointment = await this.appointmentRepository.findOneOrFail({
        where: {
          id: updatedAppointment.id,
        },
        relations: ['patientUser'],
      });
    } catch (error) {
      throw new HttpException(
        'Appointment does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.notificationService.handleAppointmentUpdateNotification(
      appointment.patientUser.firebaseId,
    );

    return await this.appointmentRepository.save(updatedAppointment);
  }

  public async deleteAppointment(
    appointment: Appointment,
  ): Promise<Appointment> {
    let appointmentDb: Appointment;
    try {
      appointmentDb = await this.appointmentRepository.findOneOrFail({
        where: {
          id: appointment.id,
        },
        relations: ['patientUser', 'doctorUser'],
      });
    } catch (error) {
      throw new HttpException(
        'Appointment does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.notificationService.handleAppointmentDeleteNotification([
      appointmentDb.doctorUser.firebaseId,
      appointmentDb.patientUser.firebaseId,
    ]);

    return await this.appointmentRepository.remove(appointment);
  }
}
