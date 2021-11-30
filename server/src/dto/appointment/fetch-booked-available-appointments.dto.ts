import { Doctor } from 'src/models/doctor.model';
export class FetchBookedOrAvailableAppointmentsDto {
  public date?: Date;
  public doctor?: Doctor;
}
