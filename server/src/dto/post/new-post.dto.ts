import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsUrl,
  ValidateNested,
} from 'class-validator';

export class CreatePostDto {
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
