import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  public comment: string;

  @IsUUID()
  public postId: string;
}
