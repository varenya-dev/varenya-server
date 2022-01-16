import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from 'src/models/activity.model';
import { Post } from 'src/models/post.model';
import { User } from 'src/models/user.model';
import { Repository } from 'typeorm';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}

  public async recordPost(user: User, post: Post): Promise<Activity> {
    const newActivity = new Activity();
    newActivity.user = user;
    newActivity.post = post;
    newActivity.activityType = 'POST';

    return await this.activityRepository.save(newActivity);
  }
}