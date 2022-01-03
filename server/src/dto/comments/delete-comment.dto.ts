import { IsUUID } from 'class-validator';

export class DeleteCommentDto {
  //NEED TO TEST
  @IsUUID()
  public commentId: string;
}
