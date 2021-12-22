import { IsNotEmpty } from 'class-validator';

export class FetchPostsByCategoryDto {
  @IsNotEmpty()
  public category: string;
}
