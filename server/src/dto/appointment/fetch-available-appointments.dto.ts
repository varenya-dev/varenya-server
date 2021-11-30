import { IsDateString, IsNotEmpty } from 'class-validator';

export class FetchAvailableAppointmentsDto {
  @IsNotEmpty()
  @IsDateString()
  public date: Date;

  @IsNotEmpty()
  public doctorId: string;
}
