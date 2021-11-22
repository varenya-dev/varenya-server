import { LoggedInUser } from './../dto/logged-in-user.dto';
import { FirebaseService } from '../modules/firebase/firebase.service';
import { UserService } from 'src/modules/user/user.service';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Roles } from 'src/enum/roles.enum';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleAuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly firebaseService: FirebaseService,
    private readonly reflector: Reflector,
  ) {}

  private async validateAuthenticationHeader(request): Promise<boolean> {
    if (
      request.headers.authorization &&
      request.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      const authToken = request.headers.authorization.split(' ')[1];
      const decodedToken =
        await this.firebaseService.firebaseAuth.verifyIdToken(authToken);

      const firebaseUser = await this.firebaseService.firebaseAuth.getUser(
        decodedToken.uid,
      );

      const databaseUser = await this.userService.findOneUserByFirebaseId(
        firebaseUser.uid,
      );

      const loggedInUser = new LoggedInUser(firebaseUser, databaseUser);

      request.user = loggedInUser;
      return true;
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  private async validateRoleForUser(request, roles: Roles[]) {
    const checkAuth = await this.validateAuthenticationHeader(request);

    if (checkAuth) {
      const user: LoggedInUser = request.user;

      if (roles.includes(user.databaseUser.role)) {
        return true;
      } else {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const roles = this.reflector.get<Roles[]>('roles', context.getHandler());

    return await this.validateRoleForUser(request, roles);
  }
}
