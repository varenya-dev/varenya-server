import { Appointment } from './appointment.model';
import { Roles } from './../enum/roles.enum';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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
  patientAppointments: Appointment[];

  @OneToMany(() => Appointment, (appointment) => appointment.doctorUser, {
    cascade: true,
  })
  doctorAppointments: Appointment[];
}
