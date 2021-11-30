import { IsDateString, IsNotEmpty } from 'class-validator';

export class FetchBookedAppointmentsDto {
  @IsNotEmpty()
  @IsDateString()
  public date: Date;
}
