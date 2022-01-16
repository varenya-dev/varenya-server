import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggedInUser } from 'src/dto/logged-in-user.dto';
import { Activity } from 'src/models/activity.model';
import { Appointment } from 'src/models/appointment.model';
import { Post } from 'src/models/post.model';
import { User } from 'src/models/user.model';
import { Repository } from 'typeorm';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}

  public async fetchActivity(loggedInUser: LoggedInUser): Promise<Activity[]> {
    return await this.activityRepository.find({
      where: {
        user: loggedInUser.databaseUser,
      },
      order: {
        createdAt: 'DESC',
      },
      relations: [
        'post',
        'appointment',
        'post.categories',
        'post.images',
        'post.user',
        'post.comments',
        'post.comments.user',
        'appointment.doctorUser',
        'appointment.patientUser',
      ],
    });
  }

  public async recordPost(user: User, post: Post): Promise<Activity> {
    const newActivity = new Activity();
    newActivity.user = user;
    newActivity.post = post;
    newActivity.activityType = 'POST';

    return await this.activityRepository.save(newActivity);
  }

  public async recordAppointment(
    user: User,
    appointment: Appointment,
  ): Promise<Activity> {
    const newActivity = new Activity();
    newActivity.user = user;
    newActivity.appointment = appointment;
    newActivity.activityType = 'APPOINTMENT';

    return await this.activityRepository.save(newActivity);
  }
}
