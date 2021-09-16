import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/user.model';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async findOneUserByFirebaseId(firebaseId: string): Promise<User> {
    return await this.userRepository.findOne({
      firebaseId,
    });
  }

  public async saveUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  public async deleteUser(user: User): Promise<User> {
    return await this.userRepository.remove(user);
  }
}
