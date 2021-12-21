import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PostImage {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public imageUrl: string;
}
