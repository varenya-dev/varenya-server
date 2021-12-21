import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PostCategory {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public categoryName: string;
}
