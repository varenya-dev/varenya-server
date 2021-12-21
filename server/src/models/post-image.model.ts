import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './post.model';

@Entity()
export class PostImage {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public imageUrl: string;

  @ManyToOne(() => Post, (post) => post.images, { onDelete: 'CASCADE' })
  public post: Post;
}
