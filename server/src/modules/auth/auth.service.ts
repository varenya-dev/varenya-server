import { UserService } from './../user/user.service';
import { FirebaseService } from './../firebase/firebase.service';
import { Injectable } from '@nestjs/common';
import { auth } from 'firebase-admin';
import { User } from 'src/models/user.model';
import { Roles } from 'src/enum/roles.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly userService: UserService,
  ) {}

  public async addRoleAndSaveToDatabase(
    loggedInUser: auth.UserRecord,
    role: Roles,
  ): Promise<User> {
    await this.firebaseService.firebaseAuth.setCustomUserClaims(
      loggedInUser.uid,
      {
        role: role,
      },
    );

    const user: User = new User();
    user.firebaseId = loggedInUser.uid;
    user.role = role;

    return await this.userService.saveUser(user);
  }
}
