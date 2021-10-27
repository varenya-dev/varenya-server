import { PatientDto } from './../patient.dto';
import { Appointment } from './../../models/appointment.model';
export class DoctorAppointmentResponse {
  public appointment: Appointment;
  public patient: PatientDto;

  constructor(appointment: Appointment, patient: PatientDto) {
    this.appointment = appointment;
    this.patient = patient;
  }
}
