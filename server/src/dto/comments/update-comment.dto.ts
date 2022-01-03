import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateCommentDto {
  @IsNotEmpty()
  public comment: string;

  @IsUUID()
  public commentId: string;
}
