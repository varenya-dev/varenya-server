import { PostImage } from './../../models/post-image.model';
import { PostCategory } from './../../models/post-category.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { Post } from 'src/models/post.model';

@Module({
  imports: [TypeOrmModule.forFeature([PostCategory, PostImage, Post])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
