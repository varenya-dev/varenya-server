import { CreatePostDto } from './../../dto/post/new-post.dto';
import { PostImage } from './../../models/post-image.model';
import { PostCategory } from './../../models/post-category.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from 'src/models/post.model';
import { LoggedInUser } from 'src/dto/logged-in-user.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostCategory)
    private readonly postCategoryRepository: Repository<PostCategory>,

    @InjectRepository(PostImage)
    private readonly postImageRepository: Repository<PostImage>,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  public async createPost(
    loggedInUser: LoggedInUser,
    createPostDto: CreatePostDto,
  ): Promise<Post> {
    const dbPostCategories = await Promise.all(
      createPostDto.categories.map(async (category) => {
        const correctedCategory = category.toUpperCase();

        const dbPostCategory = await this.postCategoryRepository.findOne({
          where: {
            categoryName: correctedCategory,
          },
        });

        if (dbPostCategory) {
          return dbPostCategory;
        } else {
          const newPostCategory = new PostCategory();
          newPostCategory.categoryName = correctedCategory;

          return await this.postCategoryRepository.save(newPostCategory);
        }
      }),
    );

    const dbPostImages = await Promise.all(
      createPostDto.images.map(async (image) => {
        const newPostImage = new PostImage();

        newPostImage.imageUrl = image;

        return await this.postImageRepository.save(newPostImage);
      }),
    );

    const newPost = new Post();
    newPost.body = createPostDto.body;
    newPost.categories = dbPostCategories;
    newPost.images = dbPostImages;
    newPost.user = loggedInUser.databaseUser;

    const dbPost = await this.postRepository.save(newPost);

    return dbPost;
  }
}
