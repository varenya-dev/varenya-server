import { DoctorAppointmentResponse } from './../../dto/appointment/doctor-appointment-response.dto';
import { FetchAvailableAppointmentsDto } from '../../dto/appointment/fetch-available-appointments.dto';
import { DoctorService } from './../doctor/doctor.service';
import { LoggedInUser } from './../../dto/logged-in-user.dto';
import { NotificationService } from './../notifications/notification.service';
import { CreateAppointmentDto } from './../../dto/appointment/create-appointment.dto';
import { FirebaseService } from './../firebase/firebase.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from 'src/models/appointment.model';
import { Between, Repository } from 'typeorm';
import { PatientDto } from 'src/dto/patient.dto';
import { Doctor } from 'src/models/doctor.model';
import { FetchBookedAppointmentsDto } from 'src/dto/appointment/fetch-booked-appointments.dto';
import { ActivityService } from '../activity/activity.service';
import { RecordsService } from '../records/records.service';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,

    private readonly doctorService: DoctorService,
    private readonly firebaseService: FirebaseService,
    private readonly notificationService: NotificationService,
    private readonly activityService: ActivityService,
    private readonly recordsService: RecordsService,
  ) {}

  public async fetchBookedAppointmentSlots(
    loggedInUser: LoggedInUser,
    fetchBookedAppointmentsDto: FetchBookedAppointmentsDto,
  ): Promise<DoctorAppointmentResponse[]> {
    const dateFlagOne = new Date(fetchBookedAppointmentsDto.date);
    const dateFlagTwo = new Date(fetchBookedAppointmentsDto.date);

    dateFlagOne.setHours(0, 0, 0);
    dateFlagTwo.setHours(0, 0, 0);

    dateFlagTwo.setDate(dateFlagTwo.getDate() + 1);

    const doctorData = await this.doctorService.getDoctorByFirebaseId(
      loggedInUser.firebaseUser.uid,
    );

    const doctorAppointments = await this.appointmentRepository.find({
      where: {
        doctorUser: doctorData,
        scheduledFor: Between(dateFlagOne, dateFlagTwo),
      },
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

  public async fetchAvailableAppointmentSlots(
    fetchAvailableAppointmentsDto: FetchAvailableAppointmentsDto,
  ): Promise<Date[]> {
    const dateFlagOne = new Date(fetchAvailableAppointmentsDto.date);
    const dateFlagTwo = new Date(fetchAvailableAppointmentsDto.date);

    dateFlagOne.setHours(0, 0, 0, 0);
    dateFlagTwo.setHours(0, 0, 0, 0);

    dateFlagTwo.setDate(dateFlagTwo.getDate() + 1);

    const doctorData = await this.doctorService.getDoctorById(
      fetchAvailableAppointmentsDto.doctorId,
    );

    let availableDates = this.prepareDummyTimeData(
      dateFlagOne,
      doctorData.shiftStartTime,
      doctorData.shiftEndTime,
    );

    const bookedAppointments = await this.appointmentRepository.find({
      where: {
        doctorUser: doctorData,
        scheduledFor: Between(dateFlagOne, dateFlagTwo),
      },
    });

    const bookedDates = bookedAppointments.map((appointment) =>
      appointment.scheduledFor.getTime(),
    );

    return availableDates.filter(
      (date) => !bookedDates.includes(date.getTime()),
    );
  }

  private prepareDummyTimeData(
    useDate: Date,
    startTime: Date,
    endTime: Date,
  ): Date[] {
    const dates: Date[] = [];

    for (let i = startTime.getHours(); i < endTime.getHours(); i++) {
      const newDate = new Date(useDate.getTime());
      newDate.setHours(i, 0, 0, 0);

      dates.push(newDate);
    }

    return dates;
  }

  public async getPatientAppointments(
    loggedInUser: LoggedInUser,
  ): Promise<Appointment[]> {
    const patientUser = loggedInUser.databaseUser;

    const patientAppointments = await this.appointmentRepository.find({
      where: {
        patientUser: patientUser,
      },
      relations: ['doctorUser', 'patientUser'],
    });

    return patientAppointments;
  }

  public async getDoctorAppointments(
    loggedInUser: LoggedInUser,
  ): Promise<Appointment[]> {
    const doctorData = await this.doctorService.getDoctorByFirebaseId(
      loggedInUser.firebaseUser.uid,
    );

    const doctorAppointments = await this.appointmentRepository.find({
      where: {
        doctorUser: doctorData,
      },
      relations: ['doctorUser', 'patientUser'],
    });

    return doctorAppointments;
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
    let doctorUser: Doctor;
    try {
      doctorUser = await this.doctorService.getDoctorById(
        createAppointmentDto.doctorId,
      );
    } catch (error) {
      throw new HttpException('Doctor does not exist', HttpStatus.NOT_FOUND);
    }

    const checkAppointment = await this.appointmentRepository.findOne({
      where: {
        scheduledFor: createAppointmentDto.timing,
      },
    });

    if (checkAppointment != null) {
      throw new HttpException(
        'This slot has been already booked.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const appointmentDetails = new Appointment(patientUser, doctorUser);
    appointmentDetails.scheduledFor = createAppointmentDto.timing;

    const savedAppointment = await this.appointmentRepository.save(
      appointmentDetails,
    );

    await this.activityService.recordAppointment(
      loggedInUser.databaseUser,
      savedAppointment,
    );

    await this.recordsService.linkDoctorAndUser(
      doctorUser.id,
      loggedInUser.databaseUser.id,
    );

    return savedAppointment;
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

    return await this.appointmentRepository.remove(appointment);
  }
}
