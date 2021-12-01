import {
  IsNotEmpty,
  IsNumber,
  IsUrl,
  IsArray,
  IsDateString,
} from 'class-validator';

export class NewOrUpdatedDoctor {
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

  @IsArray()
  public specializations: string[];

  @IsDateString()
  public shiftStartTime: Date;

  @IsDateString()
  public shiftEndTime: Date;
}
