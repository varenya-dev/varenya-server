import { ActivityService } from './../activity/activity.service';
import { FetchPostsByCategoryDto } from './../../dto/post/fetch-posts-category.dto';
import { DeletePostDto } from './../../dto/post/delete-post.dto';
import { UpdatePostDto } from './../../dto/post/update-post.dto';
import { CreatePostDto } from './../../dto/post/new-post.dto';
import { PostImage } from './../../models/post-image.model';
import { PostCategory } from './../../models/post-category.model';
import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from 'src/models/post.model';
import { LoggedInUser } from 'src/dto/logged-in-user.dto';
import { PostType } from 'src/enum/post-type.enum';
import { Roles } from 'src/enum/roles.enum';

@Injectable()
export class PostService implements OnModuleInit {
  constructor(
    @InjectRepository(PostCategory)
    private readonly postCategoryRepository: Repository<PostCategory>,

    @InjectRepository(PostImage)
    private readonly postImageRepository: Repository<PostImage>,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    private readonly activityService: ActivityService,
  ) {}

  async onModuleInit(): Promise<void> {
    const categories: { key: string; categoryName: string }[] = [
      { key: 'DEPRESSION', categoryName: 'DEPRESSION' },
      { key: 'ANXIETY', categoryName: 'ANXIETY' },
      { key: 'BIPOLAR', categoryName: 'BIPOLAR' },
      { key: 'PTSD', categoryName: 'PTSD' },
      { key: 'SUCCESS_STORY', categoryName: 'SUCCESS STORY' },
    ];

    categories.forEach(async (category) => {
      const fetchedCategory = await this.postCategoryRepository.findOne({
        where: {
          key: category.key,
        },
      });

      if (!fetchedCategory) {
        const categoryModel = new PostCategory();
        categoryModel.key = category.key;
        categoryModel.categoryName = category.categoryName;
        await this.postCategoryRepository.save(categoryModel);
      }
    });
  }

  public async fetchPostById(id: string): Promise<Post> {
    const fetchedPost = await this.postRepository.findOne({
      where: {
        id: id,
        postType: PostType.Post,
      },
      relations: [
        'images',
        'user',
        'categories',
        'comments',
        'comments.user',
        'comments.user.randomName',
        'comments.user.doctor',
        'user.randomName',
        'user.doctor',
      ],
    });

    if (fetchedPost) {
      return fetchedPost;
    } else {
      throw new NotFoundException('Post Not Found');
    }
  }

  public async fetchPostsByCategory(
    fetchPostsByCategoryDto: FetchPostsByCategoryDto,
  ): Promise<Post[]> {
    const postsByCategory = await this.postCategoryRepository.findOne({
      where: {
        categoryName: fetchPostsByCategoryDto.category.toUpperCase(),
      },
      relations: [
        'posts',
        'posts.categories',
        'posts.images',
        'posts.user',
        'posts.comments',
        'posts.comments.user',
        'posts.comments.user.randomName',
        'posts.comments.user.doctor',
        'posts.user.randomName',
        'posts.user.doctor',
      ],
    });

    if (postsByCategory) {
      return postsByCategory.posts;
    } else {
      throw new NotFoundException('Category not found');
    }
  }

  public async fetchNewPosts(): Promise<Post[]> {
    return await this.postRepository.find({
      where: {
        postType: PostType.Post,
      },
      order: {
        createdAt: 'DESC',
      },
      relations: [
        'images',
        'user',
        'categories',
        'comments',
        'comments.user',
        'comments.user.randomName',
        'comments.user.doctor',
        'user.randomName',
        'user.doctor',
      ],
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
    newPost.title = createPostDto.title;
    newPost.body = createPostDto.body;
    newPost.categories = dbPostCategories;
    newPost.images = dbPostImages;
    newPost.user = loggedInUser.databaseUser;

    const savedPost = await this.postRepository.save(newPost);

    if (loggedInUser.databaseUser.role === Roles.Main) {
      await this.activityService.recordPost(
        loggedInUser.databaseUser,
        savedPost,
      );
    }

    return savedPost;
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

    postToBeUpdated.title = updatePostDto.title;
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
