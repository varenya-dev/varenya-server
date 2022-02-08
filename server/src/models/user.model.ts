import { RandomName } from './random-name.model';
import { Doctor } from './doctor.model';
import { Appointment } from './appointment.model';
import { Roles } from './../enum/roles.enum';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from './post.model';
import { Activity } from './activity.model';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public firebaseId: string;

  @Column()
  public role: Roles;

  @OneToOne(() => RandomName, (randomName) => randomName.user, {
    cascade: true,
  })
  public randomName: RandomName;

  @OneToOne(() => Doctor, (doctor) => doctor.user, {
    cascade: true,
  })
  public doctor: Doctor;

  @OneToMany(() => Appointment, (appointment) => appointment.patientUser, {
    cascade: true,
  })
  public patientAppointments: Appointment[];

  @OneToMany(() => Post, (post) => post.user, {
    cascade: true,
  })
  public posts: Post[];

  @OneToMany(() => Activity, (activity) => activity.user, {
    cascade: true,
  })
  public activities: Activity[];
}
