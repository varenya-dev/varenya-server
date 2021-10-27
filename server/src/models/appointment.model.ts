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
}
