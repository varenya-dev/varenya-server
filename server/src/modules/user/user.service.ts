import { Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/user.model';
import { Repository } from 'typeorm';
import { Doctor } from 'src/models/doctor.model';
import { Roles } from 'src/enum/roles.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  public async findOneUserByFirebaseId(firebaseId: string): Promise<User> {
    return await this.userRepository.findOneOrFail({
      firebaseId,
    });
  }

  public async saveUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  public async deleteUser(user: User): Promise<User> {
    if (user.role === Roles.Professional) {
      await this.deleteDoctor(user);
    }
    return await this.userRepository.remove(user);
  }

  public async deleteDoctor(user: User): Promise<void> {
    const dbDoctor = await this.doctorRepository.findOne({
      user: user,
    });

    if (dbDoctor != null) {
      await this.doctorRepository.remove(dbDoctor);
    }
  }
}
