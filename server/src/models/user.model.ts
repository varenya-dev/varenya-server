import { Doctor } from './doctor.model';
import { Appointment } from './appointment.model';
import { Roles } from './../enum/roles.enum';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from './post.model';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public firebaseId: string;

  @Column()
  public role: Roles;

  @OneToOne(() => Doctor, (doctor) => doctor.user, { eager: true })
  public doctor: Doctor;

  @OneToMany(() => Appointment, (appointment) => appointment.patientUser, {
    cascade: true,
  })
  public patientAppointments: Appointment[];

  @OneToMany(() => Post, (post) => post.user, {
    cascade: true,
  })
  public posts: Post[];
}
