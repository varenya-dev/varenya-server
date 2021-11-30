import { IsNotEmpty } from 'class-validator';
export class FetchBookedOrAvailableAppointmentsDto {
  public date?: Date;

  @IsNotEmpty()
  public doctorId: string;
}
