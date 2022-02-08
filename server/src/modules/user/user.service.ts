import { RandomName } from './../../models/random-name.model';
import { Injectable, forwardRef, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/user.model';
import { Repository } from 'typeorm';
import { Doctor } from 'src/models/doctor.model';
import { Roles } from 'src/enum/roles.enum';
import {
  uniqueNamesGenerator,
  Config,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator';

@Injectable()
export class UserService {
  private randomNameGeneratorConfiguration: Config;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,

    @InjectRepository(RandomName)
    private readonly randomNameRepository: Repository<RandomName>,
  ) {
    this.randomNameGeneratorConfiguration = {
      dictionaries: [adjectives, colors, animals],
      separator: ' ',
      length: 2,
      style: 'capital',
    };
  }

  public async findOneUserByFirebaseId(firebaseId: string): Promise<User> {
    const user = await this.userRepository.findOneOrFail({
      where: {
        firebaseId,
      },
      relations: ['randomName', 'doctor'],
    });

    if (user) {
      return user;
    } else {
      throw new NotFoundException('User does not exist');
    }
  }

  public async saveUser(user: User): Promise<User> {
    const savedUser = await this.userRepository.save(user);

    if (user.role === Roles.Main) {
      const newRandomName = new RandomName();

      newRandomName.randomName = await this.generateRandomName();
      newRandomName.user = savedUser;

      await this.randomNameRepository.save(newRandomName);
    }

    return await this.userRepository.findOne(savedUser.id);
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

  private async generateRandomName(): Promise<string> {
    let randomName = uniqueNamesGenerator(
      this.randomNameGeneratorConfiguration,
    );

    while (true) {
      const checkName = await this.randomNameRepository.findOne({
        randomName: randomName,
      });

      if (checkName) {
        randomName = uniqueNamesGenerator(
          this.randomNameGeneratorConfiguration,
        );
      } else {
        break;
      }
    }

    return randomName;
  }
}
