import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './post.model';

@Entity()
export class PostCategory {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ select: false })
  public key: string;

  @Column()
  public categoryName: string;

  @ManyToMany(() => Post, (post) => post.categories)
  public posts: Post[];
}
