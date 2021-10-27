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

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  scheduledFor: Date;

  @Column({ default: ConfirmationStatus.Pending })
  status: ConfirmationStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.patientAppointments, {
    onDelete: 'CASCADE',
  })
  patientUser: User;

  @ManyToOne(() => User, (user) => user.doctorAppointments, {
    onDelete: 'CASCADE',
  })
  doctorUser: User;

  constructor(patientUser: User, doctorUser: User) {
    this.scheduledFor = new Date(Date.now());
    this.patientUser = patientUser;
    this.doctorUser = doctorUser;
  }
}
