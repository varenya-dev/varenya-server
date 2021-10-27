import { AuthUser } from 'src/decorators/auth-user.decorator';
import { AppointmentService } from './appointment.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/guards/firebase-auth.guard';
import { auth } from 'firebase-admin';
import { PatientAppointmentResponse } from 'src/dto/appointment/patient-appointment-response.dto';

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
}
