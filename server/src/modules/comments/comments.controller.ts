import { CommentsService } from './comments.service';
import { CreateCommentDto } from './../../dto/comments/create-comment.dto';
import { RoleAuthGuard } from './../../guards/role-auth.guard';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Role } from 'src/decorators/role.decorator';
import { Roles } from 'src/enum/roles.enum';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { LoggedInUser } from 'src/dto/logged-in-user.dto';
import { Post as PostModel } from 'src/models/post.model';

@Controller('comment')
@UseGuards(RoleAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @Role(Roles.Main, Roles.Professional)
  public async createComment(
    @AuthUser() loggedInUser: LoggedInUser,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<PostModel> {
    // NEED TO TEST
    return await this.commentsService.createComment(
      loggedInUser,
      createCommentDto,
    );
  }
}
