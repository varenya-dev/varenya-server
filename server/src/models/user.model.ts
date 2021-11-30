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

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public firebaseId: string;

  @Column()
  public role: Roles;

  @OneToMany(() => Appointment, (appointment) => appointment.patientUser, {
    cascade: true,
  })
  public patientAppointments: Appointment[];
}
