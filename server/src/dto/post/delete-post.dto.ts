import { IsUUID } from 'class-validator';

export class DeletePostDto {
  @IsUUID()
  public id: string;
}
