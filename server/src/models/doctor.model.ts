import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Appointment } from './appointment.model';
import { Specialization } from './specialization.model';
import { User } from './user.model';

@Entity()
export class Doctor {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public fullName: string;

  @Column({ nullable: true })
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

  @OneToMany(() => Appointment, (appointment) => appointment.doctorUser, {
    cascade: true,
  })
  public appointments: Appointment[];
}
