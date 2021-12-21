import { UpdatePostDto } from './../../dto/post/update-post.dto';
import { PostService } from './post.service';
import { RoleAuthGuard } from 'src/guards/role-auth.guard';
import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common';
import { Role } from 'src/decorators/role.decorator';
import { Roles } from 'src/enum/roles.enum';
import { CreatePostDto } from 'src/dto/post/new-post.dto';
import { Post as PostModel } from 'src/models/post.model';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { LoggedInUser } from 'src/dto/logged-in-user.dto';

@Controller('post')
@UseGuards(RoleAuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @Role(Roles.Main, Roles.Professional)
  public async createPost(
    @AuthUser() loggedInUser: LoggedInUser,
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostModel> {
    return await this.postService.createPost(loggedInUser, createPostDto);
  }

  @Put()
  @Role(Roles.Main, Roles.Professional)
  public async updatePost(
    @AuthUser() loggedInUser: LoggedInUser,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostModel> {
    // NEED TO BE TESTED.
    return await this.postService.updatePost(loggedInUser, updatePostDto);
  }
}
