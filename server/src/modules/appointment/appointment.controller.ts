import { DoctorAppointmentResponse } from './../../dto/appointment/doctor-appointment-response.dto';
import { FetchAvailableAppointmentsDto } from '../../dto/appointment/fetch-available-appointments.dto';
import { LoggedInUser } from './../../dto/logged-in-user.dto';
import { Appointment } from 'src/models/appointment.model';
import { CreateAppointmentDto } from './../../dto/appointment/create-appointment.dto';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { AppointmentService } from './appointment.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  Delete,
  Query,
} from '@nestjs/common';
import { RoleAuthGuard } from 'src/guards/role-auth.guard';
import { Role } from 'src/decorators/role.decorator';
import { Roles } from 'src/enum/roles.enum';
import { FetchBookedAppointmentsDto } from 'src/dto/appointment/fetch-booked-appointments.dto';

@UseGuards(RoleAuthGuard)
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get('available')
  @Role(Roles.Main)
  public async getAvailableAppointments(
    @Query()
    fetchAvailableAppointmentsDto: FetchAvailableAppointmentsDto,
  ): Promise<Date[]> {
    return await this.appointmentService.fetchAvailableAppointmentSlots(
      fetchAvailableAppointmentsDto,
    );
  }

  @Get('patient')
  @Role(Roles.Main)
  public async getPatientAppointments(
    @AuthUser() loggedInUser: LoggedInUser,
  ): Promise<Appointment[]> {
    return await this.appointmentService.getPatientAppointments(loggedInUser);
  }

  @Get('doctor')
  @Role(Roles.Professional)
  public async getDoctorAppointments(
    @AuthUser() loggedInUser: LoggedInUser,
    @Query()
    fetchBookedAppointmentsDto: FetchBookedAppointmentsDto,
  ): Promise<DoctorAppointmentResponse[]> {
    return await this.appointmentService.fetchBookedAppointmentSlots(
      loggedInUser,
      fetchBookedAppointmentsDto,
    );
  }

  @Post()
  @Role(Roles.Main)
  public async createNewAppointment(
    @AuthUser() loggedInUser: LoggedInUser,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    return await this.appointmentService.createNewAppointment(
      loggedInUser,
      createAppointmentDto,
    );
  }

  @Put()
  @Role(Roles.Main, Roles.Professional)
  public async updateAppointment(
    @Body() appointment: Appointment,
  ): Promise<Appointment> {
    return await this.appointmentService.updateAppointment(appointment);
  }

  @Delete()
  @Role(Roles.Main, Roles.Professional)
  public async deleteAppointment(
    @Body() appointment: Appointment,
  ): Promise<Appointment> {
    return await this.appointmentService.deleteAppointment(appointment);
  }
}
