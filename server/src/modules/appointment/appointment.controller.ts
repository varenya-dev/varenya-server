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
} from '@nestjs/common';
import { PatientAppointmentResponse } from 'src/dto/appointment/patient-appointment-response.dto';
import { DoctorAppointmentResponse } from 'src/dto/appointment/doctor-appointment-response.dto';
import { RoleAuthGuard } from 'src/guards/role-auth.guard';
import { Role } from 'src/decorators/role.decorator';
import { Roles } from 'src/enum/roles.enum';

@UseGuards(RoleAuthGuard)
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get('patient')
  @Role(Roles.Main)
  public async getPatientAppointments(
    @AuthUser() loggedInUser: LoggedInUser,
  ): Promise<PatientAppointmentResponse[]> {
    return await this.appointmentService.getPatientAppointments(loggedInUser);
  }

  @Get('doctor')
  @Role(Roles.Professional)
  public async getDoctorAppointments(
    @AuthUser() loggedInUser: LoggedInUser,
  ): Promise<DoctorAppointmentResponse[]> {
    return await this.appointmentService.getDoctorAppointments(loggedInUser);
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
