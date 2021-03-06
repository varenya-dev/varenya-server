import { FetchPostByIdDto } from './../../dto/post/fetch-post-id.dto';
import { PostCategory } from './../../models/post-category.model';
import { FetchPostsByCategoryDto } from './../../dto/post/fetch-posts-category.dto';
import { UpdatePostDto } from './../../dto/post/update-post.dto';
import { PostService } from './post.service';
import { RoleAuthGuard } from 'src/guards/role-auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from 'src/decorators/role.decorator';
import { Roles } from 'src/enum/roles.enum';
import { CreatePostDto } from 'src/dto/post/new-post.dto';
import { Post as PostModel } from 'src/models/post.model';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { LoggedInUser } from 'src/dto/logged-in-user.dto';
import { DeletePostDto } from 'src/dto/post/delete-post.dto';

@Controller('post')
@UseGuards(RoleAuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @Role(Roles.Main, Roles.Professional)
  public async fetchPostById(
    @Query() fetchPostByIdDto: FetchPostByIdDto,
  ): Promise<PostModel> {
    return await this.postService.fetchPostById(fetchPostByIdDto.postId);
  }

  @Get('new')
  @Role(Roles.Main, Roles.Professional)
  public async fetchNewPosts(): Promise<PostModel[]> {
    return await this.postService.fetchNewPosts();
  }

  @Get('category')
  @Role(Roles.Main, Roles.Professional)
  public async fetchPostsByCategory(
    @Query() fetchPostsByCategoryDto: FetchPostsByCategoryDto,
  ): Promise<PostModel[]> {
    return await this.postService.fetchPostsByCategory(fetchPostsByCategoryDto);
  }

  @Get('categories')
  @Role(Roles.Main, Roles.Professional)
  public async fetchCategories(): Promise<PostCategory[]> {
    return await this.postService.fetchCategories();
  }

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
    return await this.postService.updatePost(loggedInUser, updatePostDto);
  }

  @Delete()
  @Role(Roles.Main, Roles.Professional)
  public async deletePost(
    @AuthUser() loggedInUser: LoggedInUser,
    @Body() deletePostDto: DeletePostDto,
  ): Promise<PostModel> {
    return await this.postService.deletePost(loggedInUser, deletePostDto);
  }
}
