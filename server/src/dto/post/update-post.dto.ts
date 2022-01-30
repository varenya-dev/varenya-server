import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsUrl,
  IsUUID,
} from 'class-validator';

export class UpdatePostDto {
  @IsUUID()
  public id: string;

  @IsNotEmpty()
  public title: string;

  @IsNotEmpty()
  public body: string;

  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(4)
  @IsUrl({}, { each: true })
  public images: string[];

  @IsArray()
  @ArrayMinSize(1)
  public categories: string[];
}
