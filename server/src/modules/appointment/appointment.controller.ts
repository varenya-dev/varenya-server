import { Appointment } from 'src/models/appointment.model';
import { CreateAppointmentDto } from './../../dto/appointment/create-appointment.dto';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { AppointmentService } from './appointment.service';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/guards/firebase-auth.guard';
import { auth } from 'firebase-admin';
import { PatientAppointmentResponse } from 'src/dto/appointment/patient-appointment-response.dto';
import { DoctorAppointmentResponse } from 'src/dto/appointment/doctor-appointment-response.dto';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @UseGuards(FirebaseAuthGuard)
  @Get('patient')
  public async getPatientAppointments(
    @AuthUser() firebaseUser: auth.UserRecord,
  ): Promise<PatientAppointmentResponse[]> {
    return await this.appointmentService.getPatientAppointments(firebaseUser);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('doctor')
  public async getDoctorAppointments(
    @AuthUser() firebaseUser: auth.UserRecord,
  ): Promise<DoctorAppointmentResponse[]> {
    return await this.appointmentService.getDoctorAppointments(firebaseUser);
  }

  @UseGuards(FirebaseAuthGuard)
  @Post()
  public async createNewAppointment(
    @AuthUser() firebaseUser: auth.UserRecord,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    return await this.appointmentService.createNewAppointment(
      firebaseUser,
      createAppointmentDto,
    );
  }
}
