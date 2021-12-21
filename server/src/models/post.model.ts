import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostCategory } from './post-category.model';
import { PostImage } from './post-image.model';
import { User } from './user.model';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public body: string;

  @OneToMany(() => PostImage, (postImage) => postImage.post, { cascade: true })
  public images: PostImage[];

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  public user: User;

  @ManyToMany(() => PostCategory, (postCategory) => postCategory.posts, {
    eager: true,
  })
  @JoinTable()
  public categories: PostCategory[];

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
