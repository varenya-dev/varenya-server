import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.model';

@Entity()
export class RandomName {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public randomName: string;

  @OneToOne(() => User, (user) => user.randomName, { onDelete: 'CASCADE' })
  @JoinColumn()
  public user: User;
}
