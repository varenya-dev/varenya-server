import { IsDecimal, IsNotEmpty, IsUrl, MinLength } from 'class-validator';

export class NewDoctorDto {
  @IsNotEmpty()
  public userId: string;

  @IsNotEmpty()
  public fullName: string;

  @IsNotEmpty()
  @IsUrl()
  public imageUrl: string;
  public jobTitle: string;

  @IsNotEmpty()
  public clinicAddress: string;

  @IsNotEmpty()
  @IsDecimal()
  public cost: number;

  @MinLength(1, { each: true })
  public specializations: string[];
}
