import { RoleAuthGuard } from 'src/guards/role-auth.guard';
import { UserService } from './user.service';
import { Controller, Delete, UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { auth } from 'firebase-admin';
import { User } from 'src/models/user.model';
import { Role } from 'src/decorators/role.decorator';
import { Roles } from 'src/enum/roles.enum';

@Controller('user')
@UseGuards(RoleAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Delete()
  @Role(Roles.Main, Roles.Professional)
  public async deleteUser(
    @AuthUser() firebaseUser: auth.UserRecord,
  ): Promise<User> {
    const user = await this.userService.findOneUserByFirebaseId(
      firebaseUser.uid,
    );
    return await this.userService.deleteUser(user);
  }
}
