import {
  IsCurrency,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsUrl,
  MinLength,
} from 'class-validator';

export class NewDoctorDto {
  @IsNotEmpty()
  public fullName: string;

  @IsNotEmpty()
  @IsUrl()
  public imageUrl: string;

  @IsNotEmpty()
  public jobTitle: string;

  @IsNotEmpty()
  public clinicAddress: string;

  @IsNotEmpty()
  @IsNumber()
  public cost: number;

  @MinLength(1, { each: true })
  public specializations: string[];
}
