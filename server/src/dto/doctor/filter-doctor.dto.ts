import { IsArray, IsNotEmpty } from 'class-validator';

export class FilterDoctorDto {
  @IsNotEmpty()
  public jobTitle: string;

  @IsNotEmpty()
  @IsArray()
  public specializations: string[];
}
