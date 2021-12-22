import { FetchPostsByCategoryDto } from './../../dto/post/fetch-posts-category.dto';
import { DeletePostDto } from './../../dto/post/delete-post.dto';
import { UpdatePostDto } from './../../dto/post/update-post.dto';
import { CreatePostDto } from './../../dto/post/new-post.dto';
import { PostImage } from './../../models/post-image.model';
import { PostCategory } from './../../models/post-category.model';
import { Injectable, NotFoundException } from '@nestjs/common';
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

  public async fetchPostsByCategory(
    fetchPostsByCategoryDto: FetchPostsByCategoryDto,
  ): Promise<Post[]> {
    const postsByCategory = await this.postCategoryRepository.findOne({
      where: {
        categoryName: fetchPostsByCategoryDto.category.toUpperCase(),
      },
      relations: ['posts', 'posts.categories', 'posts.images', 'posts.user'],
    });

    if (postsByCategory) {
      return postsByCategory.posts;
    } else {
      throw new NotFoundException('Category not found');
    }
  }

  public async fetchNewPosts(): Promise<Post[]> {
    return await this.postRepository.find({
      order: {
        createdAt: 'DESC',
      },
      relations: ['images', 'user', 'categories'],
    });
  }

  public async fetchCategories(): Promise<PostCategory[]> {
    return await this.postCategoryRepository.find();
  }

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

    return await this.postRepository.save(newPost);
  }

  public async updatePost(
    loggedInUser: LoggedInUser,
    updatePostDto: UpdatePostDto,
  ): Promise<Post> {
    const postToBeUpdated = await this.postRepository.findOne({
      where: {
        id: updatePostDto.id,
        user: loggedInUser.databaseUser,
      },
      relations: ['images'],
    });

    if (!postToBeUpdated) {
      throw new NotFoundException(
        'Post not found for the given post ID and user',
      );
    }

    const dbPostCategories = await Promise.all(
      updatePostDto.categories.map(async (category) => {
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

    await this.postImageRepository.remove(postToBeUpdated.images);

    const dbPostImages = await Promise.all(
      updatePostDto.images.map(async (image) => {
        const dbImage = await this.postImageRepository.findOne({
          where: {
            imageUrl: image,
          },
        });

        if (dbImage) {
          return dbImage;
        } else {
          const newPostImage = new PostImage();

          newPostImage.imageUrl = image;

          return await this.postImageRepository.save(newPostImage);
        }
      }),
    );

    postToBeUpdated.body = updatePostDto.body;
    postToBeUpdated.categories = dbPostCategories;
    postToBeUpdated.images = dbPostImages;

    return await this.postRepository.save(postToBeUpdated);
  }

  public async deletePost(
    loggedInUser: LoggedInUser,
    deletePostDto: DeletePostDto,
  ): Promise<Post> {
    const postToBeUpdated = await this.postRepository.findOne({
      where: {
        id: deletePostDto.id,
        user: loggedInUser.databaseUser,
      },
      relations: ['images'],
    });

    if (!postToBeUpdated) {
      throw new NotFoundException(
        'Post not found for the given post ID and user',
      );
    }

    await this.postImageRepository.remove(postToBeUpdated.images);

    return await this.postRepository.remove(postToBeUpdated);
  }
}
