import { DoctorService } from './../doctor/doctor.service';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/user.model';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @Inject(forwardRef(() => DoctorService))
    private readonly doctorService: DoctorService,
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
    await this.doctorService.deleteDoctor(user);
    return await this.userRepository.remove(user);
  }
}
