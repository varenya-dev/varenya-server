import { IsUUID } from 'class-validator';

export class DeleteCommentDto {
  @IsUUID()
  public commentId: string;
}
