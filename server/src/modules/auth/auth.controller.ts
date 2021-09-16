import { AuthService } from './auth.service';
import { FirebaseAuthGuard } from './../../guards/firebase-auth.guard';
import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { auth } from 'firebase-admin';
import { User } from 'src/models/user.model';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(FirebaseAuthGuard)
  @Post('roles/main')
  public async addRoleAndSaveToDatabaseMain(
    @AuthUser() firebaseUser: auth.UserRecord,
  ): Promise<User> {
    return await this.authService.addRoleAndSaveToDatabase(
      firebaseUser,
      Roles.Main,
    );
  }

  @UseGuards(FirebaseAuthGuard)
  @Post('roles/professional')
  public async addRoleAndSaveToDatabaseProfessional(
    @AuthUser() firebaseUser: auth.UserRecord,
  ): Promise<User> {
    return await this.authService.addRoleAndSaveToDatabase(
      firebaseUser,
      Roles.Professional,
    );
  }
}
