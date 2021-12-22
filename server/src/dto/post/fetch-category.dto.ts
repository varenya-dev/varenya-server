import { IsNotEmpty } from 'class-validator';

export class FetchCategory {
  @IsNotEmpty()
  public category: string;
}
