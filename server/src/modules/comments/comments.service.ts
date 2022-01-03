import { CreateCommentDto } from './../../dto/comments/create-comment.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggedInUser } from 'src/dto/logged-in-user.dto';
import { Post } from 'src/models/post.model';
import { Repository } from 'typeorm';
import { PostType } from 'src/enum/post-type.enum';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  public async createComment(
    loggedInUser: LoggedInUser,
    createCommentDto: CreateCommentDto,
  ): Promise<Post> {
    const checkPost = await this.postRepository.findOne({
      id: createCommentDto.postId,
    });

    if (!checkPost) {
      throw new NotFoundException('Post could not be found.');
    }

    const newComment = new Post();
    newComment.body = createCommentDto.comment;
    newComment.user = loggedInUser.databaseUser;
    newComment.postType = PostType.Comment;
    newComment.post = checkPost;

    return await this.postRepository.save(newComment);
  }
}
