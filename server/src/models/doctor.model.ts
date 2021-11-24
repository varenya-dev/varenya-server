import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Specialization } from './specialization.model';
import { User } from './user.model';

@Entity()
export class Doctor {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public fullName: string;

  @Column()
  public imageUrl: string;

  @Column()
  public jobTitle: string;

  @Column()
  public clinicAddress: string;

  @Column()
  public cost: number;

  @ManyToMany(
    () => Specialization,
    (specialization) => specialization.doctors,
    { eager: true },
  )
  @JoinTable()
  public specializations: Specialization[];

  @OneToOne(() => User)
  @JoinColumn()
  public user: User;
}
