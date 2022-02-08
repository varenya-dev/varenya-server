import { LoggedInUser } from 'src/dto/logged-in-user.dto';
import { RoleAuthGuard } from 'src/guards/role-auth.guard';
import { UserService } from './user.service';
import { Controller, Delete, Get, Query, UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { User } from 'src/models/user.model';
import { Role } from 'src/decorators/role.decorator';
import { Roles } from 'src/enum/roles.enum';

@Controller('user')
@UseGuards(RoleAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Role(Roles.Main, Roles.Professional)
  public async fetchUserByFirebaseId(@Query('id') id: string): Promise<User> {
    return await this.userService.findOneUserByFirebaseId(id);
  }

  @Delete()
  @Role(Roles.Main, Roles.Professional)
  public async deleteUser(
    @AuthUser() loggedInUser: LoggedInUser,
  ): Promise<User> {
    return await this.userService.deleteUser(loggedInUser.databaseUser);
  }
}
