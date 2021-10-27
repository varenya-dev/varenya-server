import {
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.model';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  scheduledFor: Date;

  @Column()
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

  constructor(scheduledFor: Date, patientUser: User, doctorUser: User) {
    this.scheduledFor = scheduledFor;
    this.patientUser = patientUser;
    this.doctorUser = doctorUser;
  }
}
