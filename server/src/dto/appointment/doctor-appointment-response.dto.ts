import { auth } from 'firebase-admin';
import { Appointment } from './../../models/appointment.model';
export class DoctorAppointmentResponse {
  public appointment: Appointment;
  public patient: auth.UserRecord;
}
