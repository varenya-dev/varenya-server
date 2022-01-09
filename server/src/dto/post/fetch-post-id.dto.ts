import { IsUUID } from 'class-validator';

export class FetchPostByIdDto {
  @IsUUID()
  public postId: string;
}
