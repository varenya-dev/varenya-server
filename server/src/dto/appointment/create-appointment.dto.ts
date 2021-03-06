import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  doctorId: string;

  @IsNotEmpty()
  @IsDateString()
  timing: Date;
}
