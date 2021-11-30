import {
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.model';
import { ConfirmationStatus } from './../enum/confirmation-status.enum';
import { Doctor } from './doctor.model';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  scheduledFor: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.patientAppointments, {
    onDelete: 'CASCADE',
  })
  patientUser: User;

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments, {
    onDelete: 'CASCADE',
  })
  doctorUser: Doctor;

  constructor(patientUser: User, doctorUser: Doctor) {
    this.scheduledFor = new Date(Date.now());
    this.patientUser = patientUser;
    this.doctorUser = doctorUser;
  }
}
