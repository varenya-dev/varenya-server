import { UserService } from './user.service';
import { Controller, Delete, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/guards/firebase-auth.guard';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { auth } from 'firebase-admin';
import { User } from 'src/models/user.model';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(FirebaseAuthGuard)
  @Delete()
  public async deleteUser(
    @AuthUser() firebaseUser: auth.UserRecord,
  ): Promise<User> {
    const user = await this.userService.findOneUserByFirebaseId(
      firebaseUser.uid,
    );
    return await this.userService.deleteUser(user);
  }
}
