import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Post } from 'src/models/post.model';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
