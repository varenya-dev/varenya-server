import { AuthService } from './auth.service';
import { FirebaseAuthGuard } from './../../guards/firebase-auth.guard';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { auth } from 'firebase-admin';
import { User } from 'src/models/user.model';
import { NewUserDto } from 'src/dto/auth/new-user.dto';

@UseGuards(FirebaseAuthGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async addRoleAndSaveToDatabase(
    @AuthUser() firebaseUser: auth.UserRecord,
    @Body() newUserDto: NewUserDto,
  ): Promise<User> {
    return await this.authService.addRoleAndSaveToDatabase(
      firebaseUser,
      newUserDto.role,
    );
  }
}
