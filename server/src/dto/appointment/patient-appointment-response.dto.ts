import { DoctorDto } from './../doctor.dto';
import { Appointment } from './../../models/appointment.model';
export class PatientAppointmentResponse {
  public appointment: Appointment;
  public doctor: DoctorDto;

  constructor(appointment: Appointment, doctor: DoctorDto) {
    this.appointment = appointment;
    this.doctor = doctor;
  }
}
