import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Appointment } from './appointment.model';
import { Post } from './post.model';
import { User } from './user.model';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn()
  public id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true, nullable: true })
  public user: User;

  @ManyToOne(() => Post, { onDelete: 'CASCADE', eager: true, nullable: true })
  public post: Post;

  @ManyToOne(() => Appointment, {
    onDelete: 'CASCADE',
    eager: true,
    nullable: true,
  })
  public appointment: Appointment;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
