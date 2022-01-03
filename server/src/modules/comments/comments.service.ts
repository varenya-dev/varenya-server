import { DeleteCommentDto } from './../../dto/comments/delete-comment.dto';
import { UpdateCommentDto } from './../../dto/comments/update-comment.dto';
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

  public async updateComment(
    loggedInUser: LoggedInUser,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Post> {
    const checkComment = await this.postRepository.findOne({
      id: updateCommentDto.commentId,
      user: loggedInUser.databaseUser,
    });

    if (!checkComment) {
      throw new NotFoundException('Comment could not be found.');
    }

    checkComment.body = updateCommentDto.comment;

    return await this.postRepository.save(checkComment);
  }

  public async deleteComment(
    loggedInUser: LoggedInUser,
    deleteCommentDto: DeleteCommentDto,
  ): Promise<Post> {
    // NEED TO TEST
    const checkComment = await this.postRepository.findOne({
      id: deleteCommentDto.commentId,
      user: loggedInUser.databaseUser,
    });

    if (!checkComment) {
      throw new NotFoundException('Comment could not be found.');
    }

    checkComment.post = null;
    await this.postRepository.save(checkComment);

    return await this.postRepository.remove(checkComment);
  }
}
