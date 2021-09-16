import { FirebaseService } from './../modules/firebase/firebase.service';
import { Request } from 'express';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { LoggedInUser } from 'src/dto/logged-in-user.dto';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly firebaseService: FirebaseService,
  ) {}

  private async validateAuthenticationHeader(
    request: Request,
  ): Promise<boolean> {
    try {
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

        const loggedInUser = new LoggedInUser(databaseUser, firebaseUser);

        request.user = loggedInUser;
        return true;
      } else {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    } catch (error) {
      console.log(error);
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    return await this.validateAuthenticationHeader(
      context.switchToHttp().getRequest(),
    );
  }
}
